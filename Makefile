# RescueStream Frontend Development Makefile

STREAM_KEY := sk_qCxOsrbpmkx-5WSqb4BQGcYYGxwibfYC6uo9gXD1ucc
RTMP_URL := rtmp://localhost:1935/$(STREAM_KEY)

.PHONY: help demo-stream demo-stream-stop

help:
	@echo "Available targets:"
	@echo "  demo-stream       - Stream a demo test pattern to MediaMTX"
	@echo "  demo-stream-stop  - Stop the demo stream"

# Stream a test pattern to MediaMTX RTMP endpoint
# Uses ffmpeg to generate a test pattern (no libfreetype required)
demo-stream:
	@echo "Starting demo stream to $(RTMP_URL)"
	@echo "Press Ctrl+C to stop"
	ffmpeg -re -f lavfi -i testsrc2=size=1920x1080:rate=30 \
		-f lavfi -i sine=frequency=440:sample_rate=44100 \
		-c:v libx264 -preset ultrafast -tune zerolatency -b:v 2500k \
		-c:a aac -b:a 64k \
		-f flv "$(RTMP_URL)"

# Stop any running ffmpeg demo stream
demo-stream-stop:
	@pkill -f "ffmpeg.*$(STREAM_KEY)" || echo "No demo stream running"
