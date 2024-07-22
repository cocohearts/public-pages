mainframe -> aws compute warehouse -> disaggregated db

warehouse model
- several vms each with their own cpu, ram, disk, gpu, etc.
- each separated, just rent your own
- ISSUE: some tasks use only lots fo ram, lots of disk, lots of gpu (ML) etc.

disaggregated model
- large block of cpu, ram, disk that gets cut up into pieces for each job dynamically
- 