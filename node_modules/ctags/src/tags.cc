#include <string>
#include "tags.h"
#include "tag-finder.h"
#include "tag-reader.h"

void Tags::Init(Handle<Object> target) {
  NanScope();

  Local<FunctionTemplate> newTemplate = FunctionTemplate::New(Tags::New);
  newTemplate->SetClassName(NanSymbol("Tags"));
  newTemplate->InstanceTemplate()->SetInternalFieldCount(1);

  Local<ObjectTemplate> proto = newTemplate->PrototypeTemplate();
  NODE_SET_METHOD(proto, "end", Tags::End);
  NODE_SET_METHOD(proto, "exists", Tags::Exists);
  NODE_SET_METHOD(proto, "findTags", Tags::FindTags);
  NODE_SET_METHOD(proto, "getTags", Tags::GetTags);

  target->Set(NanSymbol("Tags"), newTemplate->GetFunction());
}

NODE_MODULE(ctags, Tags::Init)

NAN_METHOD(Tags::New) {
  NanScope();
  Tags *tags = new Tags(Local<String>::Cast(args[0]));
  tags->Wrap(args.This());
  NanReturnUndefined();
}

tagFile* Tags::GetFile(_NAN_METHOD_ARGS_TYPE args) {
  return node::ObjectWrap::Unwrap<Tags>(args.This())->file;
}

NAN_METHOD(Tags::GetTags) {
  NanScope();

  tagFile *tagFile = GetFile(args);
  int chunkSize = args[0]->Uint32Value();
  NanCallback *callback = new NanCallback(args[1].As<Function>());
  NanAsyncQueueWorker(new TagReader(callback, chunkSize, tagFile));
  NanReturnUndefined();
}

NAN_METHOD(Tags::FindTags) {
  NanScope();

  tagFile *tagFile = GetFile(args);
  std::string tag(*String::Utf8Value(args[0]));
  int options = 0;
  if (args[1]->BooleanValue())
    options |= TAG_PARTIALMATCH;
  else
    options |= TAG_FULLMATCH;

  if (args[2]->BooleanValue())
    options |= TAG_IGNORECASE;
  else
    options |= TAG_OBSERVECASE;

  NanCallback *callback = new NanCallback(args[3].As<Function>());
  NanAsyncQueueWorker(new TagFinder(callback, tag, options, tagFile));
  NanReturnUndefined();
}

Tags::Tags(Handle<String> path) {
  NanScope();

  std::string filePath(*String::Utf8Value(path));
  tagFileInfo info;
  file = tagsOpen(filePath.data(), &info);
  if (!info.status.opened)
    file = NULL;
}

NAN_METHOD(Tags::Exists) {
  NanScope();
  NanReturnValue(Boolean::New(GetFile(args) != NULL));
}

NAN_METHOD(Tags::End) {
  NanScope();

  tagFile *file = GetFile(args);
  if (file != NULL) {
    tagsClose(file);
    node::ObjectWrap::Unwrap<Tags>(args.This())->file = NULL;
  }

  NanReturnUndefined();
}
