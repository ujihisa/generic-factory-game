require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module GenericFactoryGame
  RELEASE_DATE = Date.parse('2020-05-29')
  VERSION_MAJOR = '1.0'
  VERSION_PATCH = '0'
  PREVIOUS_VERSION = '1.0.0-preview'

  def self.version
    "#{VERSION_MAJOR}.#{VERSION_PATCH}"
  end

  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
