require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module GenericFactoryGame
  RELEASE_DATE = Date.parse('2020-05-29')
  VERSION = '1.0'
  VERSION_PATCH = '0'
  PREVIOUS_VERSION = '1.0.0-preview'

  def self.version
    "#{VERSION_MAJOR}.#{VERSION_PATCH}"
  end


  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
  end
end
