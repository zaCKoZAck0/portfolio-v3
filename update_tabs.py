content = open('src/components/windows/CodeContent.tsx').read()
import re
new_content = content.replace('          {/* Tabs */}\n          <div\n            style={{\n              display: \"flex\",', '          {/* Tabs */}\n          {openFileIds.length > 0 && (\n          <div\n            style={{\n              display: \"flex\",')
new_content = new_content.replace('                    <VscEllipsis size={16} />\n                  </div>\n                ))}\n              </div>\n            )}\n          </div>', '                    <VscEllipsis size={16} />\n                  </div>\n                ))}\n              </div>\n            )}\n          </div>\n          )}')
open('src/components/windows/CodeContent.tsx', 'w').write(new_content)
