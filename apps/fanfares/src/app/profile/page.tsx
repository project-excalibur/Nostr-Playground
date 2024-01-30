"use client"
import { Event, generatePrivateKey } from "nostr-tools"
import Button from "../components/Button"
import { useAppState } from "../controllers/state/old/use-app-state"
import { FeedPost } from "../components/FeedPost"
import {
  usePrimalNoteStats,
  usePrimalNotes,
  usePrimalProfiles,
} from "../controllers/state/primal-slice"
import { useAccountProfile } from "../controllers/state/account-slice"
import Image from "next/image"
import { useEffect, useState } from "react"
function Profile() {
  const primalNotes = usePrimalNotes()
  const primalProfiles = usePrimalProfiles()
  const primalNoteStats = usePrimalNoteStats()
  const accountProfile = useAccountProfile()
  const [filteredEvents, setFilteredEvents] = useState<Event<1>[]>([])

  useEffect(() => {
    const filtered = primalNotes.filter(
      event => event.pubkey === accountProfile?.pubkey
    )

    setFilteredEvents(filtered)
  }, [primalNotes, accountProfile])

  return (
    <section className="container flex flex-col max-w-xl">
      <div className="relative w-full flex">
        <div className="absolute w-32 h-32">
          <img
            src={accountProfile?.picture}
            className="drop-shadow-md rounded-full w-32 h-32 object-cover object-center absolute"
            alt="profile picture"
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button className="w-32" label="edit profile" />
        </div>
      </div>
      <div className="mt-28 w-full">
        <div className="text-buttonDefault">
          <p className="">{accountProfile?.display_name}</p>
        </div>
        <p className="text-buttonDisabled text-xs/4">{accountProfile?.lud16}</p>
        <p className="text-buttonDisabled text-xs/4">{accountProfile?.nip05}</p>
      </div>
      <div className="space-y-2 mt-4">
        {filteredEvents.map(note => {
          return (
            <FeedPost
              key={generatePrivateKey()}
              note={note}
              user={accountProfile?.name}
              content={note.content}
              userPfp={accountProfile?.picture}
              userProfile={accountProfile?.lud16}
            />
          )
        })}
      </div>
    </section>
  )
}

export default Profile
