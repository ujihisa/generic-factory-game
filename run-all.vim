terminal
execute "normal! \<C-w>T"
call term_sendkeys('%', "bin/rails s\<Cr>")
terminal
call term_sendkeys('%', "bin/webpack-dev-server\<Cr>")
