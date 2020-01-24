
Pod::Spec.new do |s|
  s.name         = "RNPayjp"
  s.version      = "1.0.0"
  s.summary      = "RNPayjp"
  s.description  = <<-DESC
                  RNPayjp
                   DESC
  s.homepage     = "https://pay.jp/docs/started"
  s.license      = "MIT"
  s.author       = { "author" => "author@domain.cn" }
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/author/RNPayjp.git", :tag => "master" }
  s.source_files = "Classes/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  s.dependency "PAYJP"

end

  