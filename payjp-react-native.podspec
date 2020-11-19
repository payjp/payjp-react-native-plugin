require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))
payjp_sdk = JSON.parse(File.read(File.join(__dir__, 'sdkconfig.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.homepage     = package['homepage']
  s.license      = package['license']
  s.author       = { package['author']['name'] => package['author']['email'] }
  s.platform     = :ios, "10.0"
  s.source       = { :path => 'ios' }
  s.source_files = "ios/Classes/**/*.{h,m}"
  s.public_header_files = "ios/Classes/**/*.h"
  s.requires_arc = true
  s.static_framework = true
  
  s.dependency "React-Core"
  s.dependency 'PAYJP', "~> #{payjp_sdk['ios']}"
  s.dependency 'CardIO', '~> 5.4.1'
  s.dependency 'GoogleUtilities/AppDelegateSwizzler', '~> 7.1'

end
