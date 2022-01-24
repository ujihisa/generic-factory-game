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

RUN gem install bundler:2.1.4

RUN useradd -m -u 1000 rails
RUN mkdir $APP_HOME && chown rails $APP_HOME
RUN mkdir -p $BUNDLE_PATH && chown rails $BUNDLE_PATH
USER rails

WORKDIR $APP_HOME

COPY --chown=rails Gemfile Gemfile.lock $APP_HOME/
RUN bundle install --quiet

COPY --chown=rails package.json yarn.lock $APP_HOME/
RUN yarn install --check-files --silent --ignore-engines

EXPOSE ${PORT}

COPY --chown=rails . ./

CMD ["bin/rails", "server", "-b", "0.0.0.0"]
