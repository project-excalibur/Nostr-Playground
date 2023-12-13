export function MediaAudioUploadField() {
  return (
    <div
      id={"E2EID.uploadAudioInput"}
      // {...getRootProps({ style })}
      className="relative flex items-center w-full mt-8 bg-slate-900/20 px-2 py-3 rounded-lg">
      {/* {"filename" ? (
        <div className="absolute left-0">
          <p className="w-32 ml-4 text-xs font-thin text-left truncate md:w-1/6 ">
            {"filename"}
          </p>
          <p className="ml-2 text-xs font-thin text-left truncate">
            ({"duration"})
          </p>
        </div>
      ) : (
        <div className="absolute left-0 flex items-center w-40 gap-2 md:w-full">
          <p className="ml-2 mr-2 text-xs font-thin text-left md:w-32 ">
            Upload the <p className="font-bold">audio file </p>
            here by dragging
          </p>
          <p className="mr-auto">or</p>
        </div>
      )} */}
      <p className="text-xs md:text-base font-semibold">Select Audio File</p>
      <label
        htmlFor="audioUpload"
        className="mx-auto py-1 rounded-lg cursor-pointer px-2 bg-buttonDefault">
        <input
          type="file"
          id="audioUpload" //  {...getInputProps({ className: "" })}
          className="hidden"
        />
        {"filename" ? "Change" : "Browse"}
      </label>
      {/* <input
        className="hidden"
        //  {...register("duration")}
      /> */}

      {/* THIS HOULD BE A POPOVER */}
      <p className="text-xs w-24">Formats allowed: AAC / M4A / MP3</p>

      {/* <p className="absolute right-0 w-1/3 mr-2 text-xs font-thin text-right text-skin-muted md:w-1/4">
          Formats allowed: AAC / M4A / MP3
        </p> */}
    </div>
  )
}