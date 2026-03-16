export const PIPELINE_EVENT_MESSAGES: Record<string, string> = {
  'track.upload.received':
    'Upload received! The track has arrived at the gates of the pipeline. Our tiny backstage gremlins are carefully unpacking the audio to see what musical secrets you’ve brought us today.',

  'track.upload.validated':
    '🧪 Running integrity checks on the file… scanning headers, bits, and bytes. Everything looks clean so far — no corrupted riffs or broken waveforms detected.',

  'track.upload.stored':
    'Track safely stored in the vault. Every byte is tucked away securely. Our storage goblins promise no bits were harmed during the archival ritual.',

  'track.uploaded':
    'The track has officially entered the ingestion pipeline. Engines are spinning up and the analysis crew is getting ready to dive deep into the audio.',

  'track.petrified.started':
    '🧬 Petrified module waking up… initializing audio fingerprinting algorithms. Time to distill this song into its unique sonic DNA.',

  'track.petrified.generated':
    'Audio fingerprint successfully generated. The track now has a unique sonic identity that can be compared against the catalog.',

  'track.petrified.song.found':
    'Match found! The fingerprint aligns with an existing track in the catalog. Looks like we’ve seen this musical creature before.',

  'track.petrified.song.unknown':
    'Hmm… no match in the catalog. This fingerprint is unfamiliar. Either a brand-new discovery or a mysterious underground gem.',

  'track.fort-minor.started':
    'Fort Minor module engaged. Extracting lyrical structure, vocal patterns, and textual signals from the track. Mike Shinoda energy activated.',

  'track.fort-minor.lyrics.extracted':
    'Lyrics successfully extracted and indexed. Words, verses, and hooks are now mapped for deeper analysis.',

  'track.fort-minor.completed':
    '🎤 Lyric decoding complete. Structure analyzed, verses understood, hooks identified. Somewhere, Mike Shinoda nods approvingly.',

  'track.stereo.started':
    '🧠 Stereo cognition engine booting up… the AI is now listening closely, analyzing the musical universe contained in this track.',

  'track.stereo.genre.detected':
    '🎼 Genre detected! The AI has identified the musical lineage and stylistic signals hidden within the track.',

  'track.stereo.mood.detected':
    '🌌 Mood analysis complete. Emotional atmosphere captured — the AI now understands the vibe this track brings to the room.',

  'track.stereo.bpm.detected':
    'BPM locked in! The rhythmic heartbeat of the track has been measured and synchronized.',

  'track.stereo.completed':
    '✨ AI analysis complete. Genre, mood, rhythm, and structure have all been mapped. This track now has a fully detailed sonic profile.',

  'track.approved':
    '✅ Track approved by the pipeline council. Everything looks good — the journey continues to the next stage.',

  'track.rejected':
    '⛔ Track rejected by the pipeline. Something didn’t pass inspection. The system has halted processing for this file.',

  'track.transcoding.started':
    'Transcoding engines spinning up. Converting the track into streaming-friendly formats for different playback environments.',

  'track.transcoding.completed':
    '🎧 Transcoding finished! Multiple streaming variants are ready so listeners can enjoy the track anywhere.',

  'track.segments.persisted':
    'Audio segments successfully committed to storage. The track is now fully structured and ready for efficient playback.',

  'track.ready':
    '🚀 All systems complete! The track has finished its journey through the pipeline and is now ready for playback.',

  'track.upload.failed':
    '🔥 Upload failed. Something went wrong while receiving the track. The pipeline wizards are investigating the issue.'
}
