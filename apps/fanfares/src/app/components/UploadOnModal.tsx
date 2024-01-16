"use client"
import Button from "@/app/components/Button"
import { MediaAudioUploadField } from "@/app/components/MediaAudioUploadField"
import { MediaCreatorForm } from "@/app/components/MediaCreatorForm"
import { MediaThumbnailUploadField } from "@/app/components/MediaThumbnailUploadField"
import { FormLabelCreators } from "@/app/components/LabelForm"
import { Modal } from "@/app/components/Modal"
import { useAppState } from "@/app/controllers/state/use-app-state"
import Link from "next/link"
import { ChangeEvent, useEffect, useRef, useState } from "react"

interface UploadOnModalProps {
  onCancel?: () => void
}

export default function UploadOnModal(props: UploadOnModalProps) {
  const { onCancel } = props
  const [publishModal, setPublishModal] = useState<boolean>(false)
  const [isCheckedAudio, setIsCheckedAudio] = useState<boolean>(false)

  const handleCheckboxChangeAudio = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setIsCheckedAudio(checked)
  }

  const formRef = useRef<HTMLFormElement>(null)
  const {
    postPodcastCheckTC,
    postPodcastClear,
    postPodcastState,
    postPodcastSubmit,
    postPodcastHandleTitleChange,
    postPodcastTitle,
    accountProfile,
    postPodcastDescription,
    postPodcastLud16,
    postPodcastUnlockCost,
    postPodcastHandleCheckTCChange,
    postPodcastHandleUnlockCostChange,
    postPodcastHandleAudioChange,
    postPodcastHandleImageChange,
    postPodcastImageFile,
    postPodcastAudioFile,
    postPodcastHandleLud16Change,
    postPodcastHandleDescriptionChange,
    postPodcastSetLud16,
  } = useAppState()

  useEffect(() => {
    if (accountProfile && accountProfile.lud16) {
      postPodcastSetLud16(accountProfile.lud16)
    }
  }, [accountProfile])

  useEffect(() => {
    postPodcastClear()
  }, [postPodcastClear])

  const handlePostSubmit = (event: any) => {
    // event.preventDefault();
    setPublishModal(true)
    postPodcastSubmit({
      onSuccess(ids) {
        console.log(ids)
        alert(`Note posted with id ${ids}`)
      },
      onError(error) {
        alert(`Error posting note: ${error}`)
      },
      onClear() {
        formRef.current?.reset()
        setPublishModal(false)
      },
    })
  }

  return (
    <section className="w-full">
      {/* MODAL */}
      <Modal isOpen={publishModal}>
        State {postPodcastState}
        <button onClick={() => setPublishModal(!publishModal)}>
          ❌ BUTTON CLOSE TEST
        </button>
      </Modal>

      {/* FORM SECTION */}
      <form onSubmit={handlePostSubmit} ref={formRef}>
        <div className="relative flex flex-col items-center justify-center w-full h-full px-4 py-2">
          <div className="upperSectionForm flex flex-col w-full gap-4 md:flex-row">
            <div className="flex mx-auto">
              <div className="flex flex-col border border-buttonAccent px-2 py-1 rounded items-center justify-around w-full space-y-4 relative">
                {postPodcastImageFile ? (
                  <img
                    className="absolute object-cover object-center w-full h-full rounded"
                    src={URL.createObjectURL(postPodcastImageFile)}></img>
                ) : null}
                <p className="mt-2 text-sm">Upload Cover Image</p>
                <label
                  htmlFor="thumbnailUpload"
                  className={`mx-auto bg-buttonAccentHover hover:bg-opacity-70 px-3 py-1 rounded-full ${
                    postPodcastImageFile ? "opacity-80" : ""
                  }`}>
                  <input
                    className="hidden"
                    type="file"
                    id="thumbnailUpload"
                    aria-label="Thumbnail Upload"
                    onChange={postPodcastHandleImageChange}
                  />
                  {postPodcastImageFile ? "Change" : "Browse"}
                </label>

                <div className="text-center text-skin-muted">
                  {/* MAKE THIS AS TOOLTIP */}
                  <div className=" w-40 text-xs text-center">
                    JPG / PNG with 1:1 size ratio (min. 528x528 px) and 2 MB max
                    file size
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mx-auto space-y-4 pt-2">
              {/* <MediaNameField maxLength={MAX_TITLE_LENGTH} /> */}
              <div className="relative">
                <label>
                  <input
                    id={"E2EID.uploadTitleInput"}
                    autoComplete="false"
                    placeholder="Title"
                    className="w-full border-b-2 border-buttonAccent bg-transparent outline-none font-thin text-xl placeholder:text-xl placeholder:font-thin placeholder:text-skin-muted"
                    // requiredMessage="Please enter the Episode name"
                    maxLength={100}
                    name="name"
                    onChange={postPodcastHandleTitleChange}
                    value={postPodcastTitle}
                  />
                  <p
                    className={`absolute right-0 top-8 text-xs ${
                      "charsLeft < 8" ? "text-red-500" : "text-skin-inverted"
                    }`}>
                    {" "}
                    {"100"}
                  </p>
                </label>
              </div>

              {/* <MediaDescriptionField maxLength={MAX_DESCRIPTION_LENGTH} /> */}
              <div className="relative">
                <textarea
                  id={"E2EID.uploadDescriptionInput"}
                  placeholder="Description"
                  className="w-full h-40 min-h-[40px] max-h-[200px] bg-transparent border-b-2 outline-none resize-none notes active border-buttonAccent placeholder:text-xl placeholder:font-thin placeholder:text-skin-muted overflow-y-auto"
                  maxLength={9999}
                  name="description"
                  onChange={postPodcastHandleDescriptionChange}
                  value={postPodcastDescription}
                />
                <p
                  className={`absolute -bottom-4 right-0 text-xs ${
                    "charsLeft < 8" ? "text-red-500" : "text-skin-inverted"
                  }`}>
                  {"100"}
                </p>
              </div>
            </div>
          </div>
          <div
            id={"E2EID.uploadAudioInput"}
            className="relative flex items-center w-full mt-8 border border-buttonAccent px-2 py-3 rounded">
            <p className="text-xs">
              {postPodcastAudioFile
                ? postPodcastAudioFile.name
                : "Select Audio File"}
            </p>
            <label
              htmlFor="audioUpload"
              className="mx-auto py-1 rounded-full cursor-pointer px-3 bg-buttonDefault">
              <input
                type="file"
                id="audioUpload"
                className="hidden"
                onChange={postPodcastHandleAudioChange}
              />
              {postPodcastAudioFile ? "Change" : "Browse"}
            </label>
            <p className="text-xs w-24">Formats allowed: AAC / M4A / MP3</p>
          </div>
          {isCheckedAudio ? (
            <>
              {" "}
              <div className="flex-col w-full ">
                {/* <MediaParameterForm /> */}
                <div className="relative flex flex-col w-full mt-4">
                  <div className="flex justify-between w-full">
                    <p className="text-2xl">Parameters</p>
                    <button
                      disabled={false}
                      id={"E2EID.uploadCreatorAddButton"}
                      type="button"
                      className="hidden items-center md:px-4 mt-auto text-xs bg-buttonDefault rounded-md px-2 py-1"
                      onClick={() => {}}>
                      Add Creator
                    </button>
                  </div>
                  <div className="w-full">
                    {" "}
                    <div
                      key={"field.id"}
                      className="flex flex-col w-full md:gap-4 md:flex-row md:items-center md:justify-center mt-4 space-y-4 md:space-y-0">
                      <FormLabelCreators>
                        {" "}
                        <p>
                          LUD16 Address {/* THIS SHOULD BE A POPOVER */}
                          <span className="text-skin-muted hidden">() </span>
                        </p>{" "}
                        <input
                          id={"`${E2EID.uploadCreatorWalletInputX}${index}`"}
                          autoComplete="off"
                          className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
                          placeholder="Enter Creator LUD16 Address"
                          name={"`creators.${index}.wallet`"}
                          maxLength={48} // 44 seems to be the max
                          value={postPodcastLud16}
                          onChange={postPodcastHandleLud16Change}
                        />
                      </FormLabelCreators>
                      <FormLabelCreators>
                        {" "}
                        <p>
                          Unlock cost {/* THIS SHOULD BE A POPOVER */}
                          <span className="text-skin-muted">( in Sats )</span>
                        </p>{" "}
                        <input
                          type="number"
                          id={"`${E2EID.uploadCreatorWalletInputX}${index}`"}
                          autoComplete="off"
                          className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
                          placeholder="Unlock cost"
                          name={"`creators.${index}.wallet`"}
                          maxLength={48} // 44 seems to be the max
                          value={postPodcastUnlockCost}
                          onChange={postPodcastHandleUnlockCostChange}
                        />
                      </FormLabelCreators>

                      {/* <FormLabelCreators className="hidden">
                    Revenue Share %
                    <input
                      id={"`${E2EID.uploadCreatorSplitInputX}${index}`"}
                      defaultValue={100}
                      max={100}
                      min={1}
                      type="number"
                      className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
                    ></input>
                  </FormLabelCreators> */}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          <div className="flex items-center w-full mt-4">
            {/* <Modal isOpen={isCheckedAudio}>
            {<Upload onClick={() => setIsCheckedAudio(!isCheckedAudio)} />}
          </Modal> */}

            {/* ----- Toggle Paid Content Main Feed Page ----- */}

            <label
              htmlFor="setAsGatedPodcast"
              className="relative inline-flex items-center px-2 py-1 border rounded-full cursor-pointer border-buttonAccent">
              <input
                checked={isCheckedAudio}
                onChange={handleCheckboxChangeAudio}
                type="checkbox"
                value=""
                name="setAsGatedPodcast"
                id="setAsGatedPodcast"
                className="sr-only peer"
              />
              <div className="w-10 h-6 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 dark:peer-focus:ring-buttonAccent rounded-full peer dark:bg-skin-fill peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-2 after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-buttonAccentHover"></div>
              <span className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300">
                Paid Podcast?
              </span>
            </label>
          </div>
          {/* Debugging / User Validation */}
          <p
            className="mt-8 text-red-600 hidden"
            id={"E2EID.uploadErrorMessage"}>
            {/* {validationError?.error ?? ""} */}
          </p>
          <p className="hidden" id={"E2EID.uploadErrorType"}>
            {/* {validationError?.type ?? ""} */}
          </p>

          <div className="flex flex-col gap-2 mt-8 w-full items-center">
            <label htmlFor="TermsAndConditionCheckbox">
              <input
                required
                id={"E2EID.uploadTermsCheckbox"}
                className="mr-2"
                type="checkbox"
                onChange={postPodcastHandleCheckTCChange}
                checked={postPodcastCheckTC}
              />
              I agree to the{" "}
              <Link
                href=""
                className="underline text-buttonMuted hover:text-buttonAccentHover">
                Terms and Conditions
              </Link>
            </label>
            <div className="flex w-full gap-4 justify-center mt-4 my-2">
              {" "}
              <Button
                onClick={onCancel}
                type="button"
                label="Cancel"
                id={"E2EID.uploadPublishButton"}
                className="px-5 text-xs"
              />
              <Button
                onClick={() => handlePostSubmit(null)}
                type="button"
                label="Submit"
                id={"E2EID.uploadPublishButton"}
                className="px-5 text-xs"
              />
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}