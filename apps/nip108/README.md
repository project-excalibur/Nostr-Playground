# NIP-108

This repo is the first implementation of NIP-108; Lightning Gated Notes. It is a way for anyone to create lightning-gated notes on Nostr.

If you want to play with it you can:

Check out the demo client at [nostrplayground.com](nostrplayground.com)

-- OR --

Build and host everything from scratch below:

# Setup

We used bun for this implementation. If you haven't you should install it.

To install:
```bash
bun install
```

Run the server:
```bash
bun nip108-server
```

Run the client:
```bash
bun nip108-client
```

Create a gated note:
```bash
bun nip108-script
```

# NIP
NIP-108
======

Lightning Gated Notes
-------------------------------

`draft` `optional` `author:coachchuckff` `author:excalibur_guild`

This NIP defines three events for gating Notes behind lightning paywalls: 

- Lightning-Gated Note ( `kind:55` ): This note allows you wrap any type of note behind a lightning gated paywall by encrypting the payload with a purchasable decrypt key.
- Key Note ( `kind:56` ): This note encrypts the key for a given note, per user, using [NIP-04](https://github.com/nostr-protocol/nips/blob/master/04.md) between the corresponding gate creator's public key and the purchasers. It is linked to the gated note with the `g` tag.
- Announcement Note ( `kind:54` ): This note acts as the announcement of the gated note, giving a short preview of the content. It is linked to the gated note with the `g` tag.

A complete open-source implantation of [NIP-108 is available](https://github.com/project-excalibur/Nostr-Playground/tree/main/apps/nip108).

## Protocol flow
### Creating Gated Notes
1. Poster creates a note of any kind
2. Poster `JSON.stringify`'s the whole note.
3. Poster encrypts the note string with a new nsec `secret`, and `iv` using `aes-256-cbc`.
4. Poster creates the gated note `kind:55` with the encrypted note json string in the `content` field, while putting `iv`, `cost` (mSats), and `endpoint` as tags. The `endpoint` tag is the server endpoint you use to hold your `secret`'s and issue lightning invoices from your `lud16`.
5. Poster then creates an announcement note `kind:54` with the `g` tag (gated note's id) to preview the gated content.

### Consuming Gated Notes
1. Client finds gated content they want to purchase by browsing `kind:54` announcement notes. 
2. Client loads the associated gated note of `kind:55` found in the `g` tag
3. Client then GETs the `[endpoint]/[id]`
4. Gate server will respond with a 402 PR requesting a payment for the `cost` tag's amount in mSats
5. Client pays the amount
6. Client uses the `successAction` url returned in the PR to fetch the `secret` which will unlock the gated content.
7. Client uses the `secret` and the gated note's `iv` tag to decrypt the content using `aes-256-cbc`
8. Client then creates a key note `kind:56` with the content being the `nip-04` encrypted secret with their publicKey and the gate note's creator publicKey.
9. Upon revisiting the gated note, the client can then decrypt the content using their key note.  

## Server Functions
NIP-108 requires an outside server to store `secret`s and issue lighting invoices to those wishing to purchase the digital content.

The server should have two endpoints:
`[endpoint]/create` - POST to create new notes
`[endpoint]/[id]` - GET to fetch the PR to purchase the gated note's `secret`, where `id` is the gated note's `id`.


### Create a Gated Note
The server first needs to be able to store a gated note's `secret`. Minimally, the server needs to store four items: the gated note's `id`, the owner's `lud16`, the decrypt `secret`, and the `cost` in msats.

It is advised to also check, server-side, that the gated note can be unlocked. To accomplish this the following should be done:

1. Accept a POST to the server's `create` endpoint, with the following: `gateEvent`, `lud16`, `secret`, and `cost`;
2. The server should then decrypt the `gateEvent` using the `secret` and the `iv` tag provided in the event. Since a gated event is just an encrypted JSON stringified event, you should be able to check any of the decrypted note's field to know it's been decrypted successfully.
3. One should also check that the `endpoint` matches the server's domain
4. Store in the server's database the gated note's `id`, owner's `lud16`, decrypt `secret` and `cost`. 

```typescript
APP.post("/create")
```

```typescript
export interface CreateNotePostBody {
  gateEvent: VerifiedEvent<number>;
  lud16: string;
  secret: string;
  cost: number;
}
```

### Handling Purchases
Once the server has stored a gated note's `secret`, it can then be purchased via lightning. 

1. A user will GET `[endpoint]/[id]` and the server will...
   1. If `id` exists, return a 402 with a PR fetched from the stored `lud16` for the amount of the stored `cost`
   2. If `id` does not exist, return a 404.
2. The PR will contain a `successAction` url which should be formatted as such: `[endpoint]/[id]/[payment_hash]`. It is up to the user to poll this `successAction`.
3. When the `[endpoint]/[id]/[payment_hash]` endpoint is hit, the server should check the payment status...
   1. If paid, return a JSON string `{secret: [secret]}`
   2. If not paid, return a 402 with the same PR


```typescript
APP.get("/:noteId")
```

```typescript
APP.get("/:noteId/:paymentHash")
```

## Event Reference and Examples
### Gated Note ( Kind:55 )

`kind:55`

`.content` should be a JSON stringified event of any kind.

`.tag` MUST include the following:

- `iv`, the **i**nitialization **v**ector used to encrypt the `content`
- `cost`, the cost to unlock in msats
- `endpoint`, the domain of the server used to store your decrypt `secret`. The user can then call GET on `[endpoint]/[id]` to fetch the unlock PR.

### Announcement Note ( Kind:54 )

`kind:54`

`.content` some preview or announcement of the content you have locked away.

`.tag` MUST include the following:

- `g`, the id of the gated event.

### Key Note ( Kind:56 )

`kind:54`

`.content` the `secret` encrypted via [NIP-04](https://github.com/nostr-protocol/nips/blob/master/04.md)'s encrypt function between the gated note's creator's pubkey and your pubkey.

`.tag` MUST include the following:

- `g`, the id of the gated event.

### Encryption/Decryption

To encrypt/decrypt `kind:56` key notes, we use [NIP-04](https://github.com/nostr-protocol/nips/blob/master/04.md)'s encrypt/decrypt functions between the gated note's creator's pubkey and your pubkey.

To encrypt/decrypt the gated note, we use `aes-256-cbc`. Below is a simple implementation in ts:

```typescript
import * as cryptoBrowser from 'crypto-browserify';

const algorithm: string = 'aes-256-cbc';

export interface EncryptedOutput {
    iv: string;
    content: string;
}

export function hashToKey(inputString: string): Buffer {
    return cryptoBrowser.createHash('sha256').update(inputString).digest();
}

export function encrypt(text: string, key: Buffer): EncryptedOutput {
    const iv: Buffer = cryptoBrowser.randomBytes(16);
    const cipher = cryptoBrowser.createCipheriv(algorithm, key, iv);
    const encrypted: Buffer = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}

export function decrypt(iv: string, content: string, key: Buffer): string {
    const decipher = cryptoBrowser.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    const decrypted: Buffer = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);

    return decrypted.toString('utf8');
}

```

### Problems

- Servers need to be trusted
- Nothing is stopping people from freely giving their decrypt key

### Example Implementations

- [Client](https://nip-108.nostrplayground.com/)
- [Server](https://github.com/project-excalibur/Nostr-Playground/tree/main/apps/nip108)
