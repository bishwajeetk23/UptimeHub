# worker
### worker will read from queue and according to length it will auto scale and will evenly distribute the processing according to region using Redis stream

// read from the stream
// process the website and store the result in the BD. TODO: It should probably be routed through a queue in a bulk DB request.
        