require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.homepage     = package['homepage']
  s.license      = package['license']
  s.author       = { package['author']['name'] => package['author']['email'] }
  s.platform     = :ios, "9.0"
  s.source       = { :path => 'ios' }
  s.source_files = "ios/Classes/**/*.{h,m}"
  s.public_header_files = "ios/Classes/**/*.{h,m}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "PAYJP"

end