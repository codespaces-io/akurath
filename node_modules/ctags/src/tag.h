#ifndef SRC_TAG_H_
#define SRC_TAG_H_

#include <string>
#include "readtags.h"

class Tag {
 public:
  Tag(tagEntry entry) {
    name = entry.name;
    file = entry.file;
    kind = entry.kind != NULL ? entry.kind : "";
    pattern = entry.address.pattern != NULL ? entry.address.pattern : "";
  }

  std::string name;
  std::string file;
  std::string kind;
  std::string pattern;
};

#endif  // SRC_TAG_H_
