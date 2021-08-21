source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.0.2'

gem 'rails'
gem 'puma', '>= 4.3'
gem 'sass-rails', '>= 6'
gem 'webpacker', '>= 4.0'
gem 'turbolinks', '>= 5'
gem 'jbuilder', '>= 2.7'

gem 'bootsnap', '>= 1.4.2', require: false

group :development, :test do
  gem 'sqlite3', '>= 1.4'
  gem 'byebug'
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :test do
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
  gem 'webdrivers'
end

group :production do
  gem 'pg', '>= 0.18', '< 2.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data'

gem 'react-rails'
gem 'devise'
gem 'rexml' # for bootsnap
