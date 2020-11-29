FROM ruby:2.7.1

RUN \
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update -qq && apt-get install -y build-essential nodejs yarn

ENV APP_HOME /app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN gem install bundler:2.1.4
ADD Gemfile $APP_HOME/Gemfile
RUN bundle install
COPY . $APP_HOME

EXPOSE ${PORT}

RUN yarn install --check-files
# RUN RAILS_ENV=production bundle exec rake assets:precompile # It's build time
CMD ["bin/rails", "server", "-b", "0.0.0.0"]
