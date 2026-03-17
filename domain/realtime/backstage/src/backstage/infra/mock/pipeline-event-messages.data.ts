export const PIPELINE_EVENT_MESSAGES: Record<string, string> = {
  'track.upload.received':
    'Upload received! The track has arrived at the gates of the pipeline. Our tiny backstage gremlins are carefully unpacking the audio to see what musical secrets you’ve brought us today.',

  'track.upload.validated':
    '🧪 Running integrity checks on the file… scanning headers, bits, and bytes. Everything looks clean so far — no corrupted riffs or broken waveforms detected.',

  'track.upload.stored':
    'Track safely stored in the vault. Every byte is tucked away securely. Our storage goblins promise no bits were harmed during the archival ritual.',

  'track.uploaded':
    'The track has officially entered the ingestion pipeline. Engines are spinning up and the analysis crew is getting ready to dive deep into the audio.',

  'track.petrified.generated':
    'Audio fingerprint successfully generated. The track now has a unique sonic identity that can be compared against the catalog.',

  'track.petrified.song.found':
    'Match found! The fingerprint aligns with an existing track in the catalog. Looks like we’ve seen this musical creature before.',

  'track.petrified.song.unknown':
    'Hmm… no match in the catalog. This fingerprint is unfamiliar. Either a brand-new discovery or a mysterious underground gem.',

  'track.fort-minor.started':
    'Fort Minor module engaged. Extracting lyrical structure, vocal patterns, and textual signals from the track. Mike Shinoda energy activated.',

  'track.fort-minor.completed':
    '🎤 Lyric decoding complete. Structure analyzed, verses understood, hooks identified. Somewhere, Mike Shinoda nods approvingly.',

  'track.stereo.started':
    '🧠 Stereo cognition engine booting up… the AI is now listening closely, analyzing the musical universe contained in this track.',

  'track.approved':
    '✅ Track approved by the pipeline council. Everything looks good — the journey continues to the next stage.',

  'track.rejected':
    '⛔ Track rejected by the pipeline. Something didn’t pass inspection. The system has halted processing for this file.',

  'track.transcoding.started':
    'Transcoding engines spinning up. Converting the track into streaming-friendly formats for different playback environments.',

  'track.transcoding.completed':
    '🎧 Transcoding finished! Multiple streaming variants are ready so listeners can enjoy the track anywhere.',

  'track.hls.generated':
    'HLS package generated. Playlists and streaming segments are now prepared for durable persistence.',

  'track.hls.stored':
    '🚀 HLS artifacts stored successfully. The track has finished its journey through the processing pipeline and is now ready for playback.',

  'track.upload.failed':
    '🔥 Upload failed. Something went wrong while receiving the track. The pipeline wizards are investigating the issue.'
}
