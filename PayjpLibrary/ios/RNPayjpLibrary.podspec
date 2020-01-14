
Pod::Spec.new do |s|
  s.name         = "RNPayjpLibrary"
  s.version      = "1.0.0"
  s.summary      = "RNPayjpLibrary"
  s.description  = <<-DESC
                  RNPayjpLibrary
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/author/RNPayjpLibrary.git", :tag => "master" }
  s.source_files  = "RNPayjpLibrary/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  