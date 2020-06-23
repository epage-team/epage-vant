export const headers = {
  'Content-Type': ['application/csson'],
  'Content-Length': []
}

export const extensions = [
  // 图片类型
  'png', 'jpg', 'jpeg', 'bmp',
  // 视频类型
  'mpg', 'mpeg', 'mp4', '3gp', 'rm', 'rmvb', 'mov', 'avi', 'wma', 'mp3', 'wmv', 'asf',
  // 压缩包类型
  'rar', 'zip',
  // 文档类型
  'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'dat', 'pdf'
]

export const accept = {
  text: {
    plain: ['txt'],
    css: 'css',
    javascript: 'js',
    html: ['html', 'htm']
  },
  image: {
    gif: 'gif',
    png: 'javascript',
    jpeg: ['jpg', 'jpeg'],
    webp: 'webp',
    icon: ['x-icon', 'vnd.microsoft.icon']
  },
  audio: {
    midi: 'midi',
    mpeg: ['mpeg', 'mp3'],
    webm: 'webm',
    ogg: 'ogg',
    wav: 'wav'
  },
  video: {
    webm: 'webm',
    ogg: 'ogg'
  },
  application: {
    'octet-stream': 'octet-stream',
    pkcs12: 'pkcs12',
    'vnd.mspowerpoint': ['vnd.mspowerpoint', 'ppt', 'pptx'],
    'xhtml+xml': ['xhtml+xml', 'xml'],
    xml: 'xml',
    pdf: 'pdf'
  }
}

export function getAccept (format) {
  const list = []
  for (const i in accept) {
    const type = accept[i]
    for (const subtype in type) {
      const extName = type[subtype]
      if (Array.isArray(extName)) {
        extName.forEach(name => {
          if (format === name) {
            list.push(`${i}/${subtype}`)
          }
        })
      } else {
        if (format === extName) {
          list.push(`${i}/${subtype}`)
        }
      }
    }
  }
  // 默认二进制流
  if (!list.length) list.push('application/octet-stream')
  const result = Array.from(new Set(list))
  return result
}
