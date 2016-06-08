Pod::Spec.new do |s|
  s.name             = "react-native-mixpanel"
  s.version          = "0.0.6"
  s.summary          = "React Native wrapper for Mixpanel tracking"
  s.requires_arc = true
  s.author       = { 'Davide Scalzo' => 'davidescalzo@gmail.com' }
  s.license      = 'MIT'
  s.homepage     = 'n/a'
  s.source       = { :git => "https://github.com/davodesign84/react-native-mixpanel.git" }
  s.source_files = 'RNMixpanel/*'
  s.platform     = :ios, "7.0"
  s.dependency 'Mixpanel'
  s.dependency 'React'
end
