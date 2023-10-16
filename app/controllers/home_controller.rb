class HomeController < ApplicationController
  def index
    @ogp = {
      title: "GenericFactoryGame is a resource-management and factory building game",
      description: %[As a factory owner, you have a factory that employees consume "generic" ingredients to produce "generic" products. You can sign some contracts with customers who need the products to be delivered, so that you can gain sales. It'll be the best to satisfy exact demands they require -- note that the demands change in certain months!],
    }
  end
end
