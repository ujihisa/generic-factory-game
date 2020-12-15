ARG RUBY_VERSION
FROM ruby:${RUBY_VERSION}

RUN \
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update -qq && \
  apt-get install -y build-essential nodejs yarn && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

ENV APP_HOME=/app \
  BUNDLE_PATH=/vendor/bundle/$RUBY_VERSION
RUN \
  mkdir $APP_HOME && \
  mkdir -p $BUNDLE_PATH
WORKDIR $APP_HOME

RUN gem install bundler:2.1.4
COPY Gemfile* $APP_HOME/
RUN bundle install --quiet

COPY package.json yarn.lock $APP_HOME/
RUN yarn install --check-files --silent

EXPOSE ${PORT}

# RUN RAILS_ENV=production bundle exec rake assets:precompile # It's build time
CMD ["bin/rails", "server", "-b", "0.0.0.0"]
