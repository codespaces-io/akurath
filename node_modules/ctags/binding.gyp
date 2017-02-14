{
  'targets': [
    {
      'target_name': 'ctags',
      'include_dirs': [ '<!(node -e "require(\'nan\')")' ],
      'sources': [
        'src/readtags.c',
        'src/tags.cc',
        'src/tag-finder.cc',
        'src/tag-reader.cc'
      ],
      'conditions': [
        ['OS=="win"', {
          'msvs_disabled_warnings': [
            4267,  # conversion from 'size_t' to 'int', possible loss of data
            4530,  # C++ exception handler used, but unwind semantics are not enabled
            4506,  # no definition for inline function
          ],
        }],
      ],
    }
  ]
}
