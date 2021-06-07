if `git branch --show-current`.chomp != 'master'
  abort 'Run in master branch.'
end

system('git pull --rebase', exception: true)
system('bundle lock --update', exception: true)
system('doo -b bundle update', exception: true)
if `git diff -- Gemfile.lock` != ''
  system("git add Gemfile.lock && git commit -m 'bundle lock --update'", exception: true)
end

system('doo -b yarn upgrade', exception: true)
if `git diff -- yarn.lock` != ''
  system("git add ./yarn.lock && git commit -m 'yarn upgrade'", exception: true)
end

system('doo bin/rails test', exception: true)

system('git push', exception: true)

puts 'All done'

system('docker-compose down', exception: true)
