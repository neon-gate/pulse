import { Test } from '@nestjs/testing'

import { StartPlaybackUseCase } from '@application/use-cases/start-playback.usecase'
import {
  FortMinorEventBusPort,
  type FortMinorEventBus,
  SegmentStorePort,
  TranscoderPort
} from '@domain/ports'

describe('StartPlaybackUseCase', () => {
  it('transcodes and emits events when playlist is missing', async () => {
    const segments: Partial<SegmentStorePort> = {
      getInputFile: jest.fn().mockResolvedValue('/tmp/input.mp3'),
      ensureOutputDir: jest.fn().mockResolvedValue('/tmp/output'),
      playlistExists: jest.fn().mockResolvedValue(false)
    }
    const transcoder: Partial<TranscoderPort> = {
      transcode: jest.fn().mockResolvedValue({
        outputDir: '/tmp/output',
        playlistPath: '/tmp/output/playlist.m3u8'
      })
    }
    const events: FortMinorEventBus = {
      emit: jest.fn().mockResolvedValue(undefined),
      on: jest.fn()
    }

    const module = await Test.createTestingModule({
      providers: [
        StartPlaybackUseCase,
        { provide: SegmentStorePort, useValue: segments },
        { provide: TranscoderPort, useValue: transcoder },
        { provide: FortMinorEventBusPort, useValue: events }
      ]
    }).compile()

    const useCase = module.get(StartPlaybackUseCase)
    const result = await useCase.execute('track-id')

    expect(transcoder.transcode).toHaveBeenCalledTimes(1)
    expect(events.emit).toHaveBeenCalledWith(
      'streaming.fort-minor.transcode.completed',
      expect.objectContaining({ trackId: 'track-id' })
    )
    expect(events.emit).toHaveBeenCalledWith(
      'streaming.fort-minor.stream.started',
      expect.objectContaining({ trackId: 'track-id' })
    )
    expect(result.trackId).toBe('track-id')
  })

  it('skips transcode when playlist exists', async () => {
    const segments: Partial<SegmentStorePort> = {
      getInputFile: jest.fn().mockResolvedValue('/tmp/input.mp3'),
      ensureOutputDir: jest.fn().mockResolvedValue('/tmp/output'),
      playlistExists: jest.fn().mockResolvedValue(true)
    }
    const transcoder: Partial<TranscoderPort> = {
      transcode: jest.fn()
    }
    const events: FortMinorEventBus = {
      emit: jest.fn().mockResolvedValue(undefined),
      on: jest.fn()
    }

    const module = await Test.createTestingModule({
      providers: [
        StartPlaybackUseCase,
        { provide: SegmentStorePort, useValue: segments },
        { provide: TranscoderPort, useValue: transcoder },
        { provide: FortMinorEventBusPort, useValue: events }
      ]
    }).compile()

    const useCase = module.get(StartPlaybackUseCase)
    await useCase.execute('track-id')

    expect(transcoder.transcode).not.toHaveBeenCalled()
    expect(events.emit).toHaveBeenCalledWith(
      'streaming.fort-minor.stream.started',
      expect.objectContaining({ trackId: 'track-id' })
    )
  })
})
