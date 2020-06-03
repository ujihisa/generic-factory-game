// Run this example by adding <%= javascript_pack_tag 'hello_typescript' %> to the head of your layout file,
// like app/views/layouts/application.html.erb.
import React from 'react'

function Hello({ message }: { message: string }) {
  return <div>{message}</div>
}

console.log(<Hello message="Hello world from TSX" />);
