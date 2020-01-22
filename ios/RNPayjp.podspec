require 'json'

package = JSON.parse(File.read(File.join('../', 'package.json')))

Pod::Spec.new do |s|
  s.name          = package['name']
  s.version       = package['version']
  s.summary       = package['description']

  s.homepage      = package['homepage']
  s.license       = package['license']
  s.author        = package['author']
  s.platform      = :ios, '9.0'
  s.source        = { :git => 'https://github.com/author/RNPayjp.git', :tag => 'master' }
  s.source_files  = 'Classes/**/*.{h,m}'
  s.requires_arc  = true

  s.dependency 'React'
  s.dependency 'PAYJP'

end

  
