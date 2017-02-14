#include "tag-finder.h"

void TagFinder::Execute() {
  tagEntry entry;
  if (tagsFind(file, &entry, tag.data(), options) == TagSuccess) {
    matches.push_back(Tag(entry));
    while (tagsFindNext(file, &entry) == TagSuccess)
      matches.push_back(Tag(entry));
  }
}

void TagFinder::HandleOKCallback() {
  NanScope();

  Handle<Array> array = Array::New(matches.size());
  for (size_t i = 0; i < matches.size(); i++) {
    Local<Object> tagObject = Object::New();
    tagObject->Set(NanSymbol("name"), NanSymbol(matches[i].name.data()));
    tagObject->Set(NanSymbol("file"), NanSymbol(matches[i].file.data()));
    tagObject->Set(NanSymbol("kind"), NanSymbol(matches[i].kind.data()));
    if (matches[i].pattern.length() > 0)
      tagObject->Set(NanSymbol("pattern"),
                     NanSymbol(matches[i].pattern.data()));
    array->Set(i, tagObject);
  }

  Local<Value> argv[] = {
    Local<Value>::New(Null()),
    Local<Value>::New(array)
  };
  callback->Call(2, argv);
}
