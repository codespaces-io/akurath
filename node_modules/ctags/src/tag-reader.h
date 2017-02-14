#ifndef SRC_TAG_READER_H_
#define SRC_TAG_READER_H_

#include <node.h>
#include <vector>
#include "nan.h"
#include "tag.h"
#include "readtags.h"

using namespace v8;

class TagReader : public NanAsyncWorker {
 public:
  TagReader(NanCallback *callback, int chunkSize, tagFile *file)
    : NanAsyncWorker(callback), chunkSize(chunkSize), file(file) {}

  ~TagReader() {}

  void Execute();
  void HandleOKCallback();

 private:
  int chunkSize;
  std::vector< Tag > tags;
  tagFile *file;
};

#endif  // SRC_TAG_READER_H_
