require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.requires_arc = true
  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.source       = { :git => "https://github.com/davodesign84/react-native-mixpanel.git" }
  s.source_files = 'RNMixpanel/*'
  s.platform     = :ios, "8.0"
  s.tvos.deployment_target = '10.0'
  s.dependency 'Mixpanel', '~> 3.6.0'
  s.dependency 'React'
end
