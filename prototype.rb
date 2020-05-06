def status()
  puts "Current month: #{current_month}, money: #{@money}, (ingredient+product)/storage: (#{@ingredient}+#{@product})/#{@storage}"
end

def start
  @month = 0
  @money = 100
  @storage = 0
  @ingredient = 0
  @product = 0
  @factories = {
    manual: nil,
    semi: nil,
    auto: nil,
    idle: {junior: 0, intermediate: 0, senior: 0},
  }
  @contracts = []
  status()
end

private def current_month
  [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ][@month % 12]
end

def buy_storage
  @money -= 1
  @storage += 100
end

def buy_factory(type)
  case type
  when :manual
    @money -= 0
    @factories[:manual] = {junior: 0, intermediate: 0, senior: 0}
  when :semi
    @money -= 50
    @factories[:semi] = {junior: 0, intermediate: 0, senior: 0}
  when :auto
    @money -= 100
    @factories[:auto] = {junior: 0, intermediate: 0, senior: 0}
  else
    raise 'Must not happen'
  end
end

def hire(type)
  case type
  when :junior
    @factories[:idle][:junior] += 1
  when :intermediate
    @factories[:idle][:intermediate] += 1
  when :senior
    @factories[:idle][:senior] += 1
  else
    raise 'Must not happen'
  end
end

def dispatch(employee_type, factory_from, factory_to)
  if @factories[factory_from][employee_type] && @factories[factory_to]
    @factories[factory_from][employee_type] -= 1
    @factories[factory_to][employee_type] += 1
  else
    raise 'Mut not happen'
  end
end

def buy_ingredient
  if @ingredient + @product + 20 <= @storage
    @money -= 1
    @ingredient += 20
  else
    raise 'Must not happen'
  end
end

def contract(contract_type)
  @contracts <<
    case contract_type
    when :A
      h = Hash.new([20, 10])
      h['November'] = [40, 20]
      h
    when :B
      h = Hash.new([40, 20])
      h['February'] = [0, 0]
      h
    when :C
      h = Hash.new([60, 32])
      h['July'] = [100, 50]
      h['August'] = [100, 50]
      h
    when :D
      h = Hash.new([80, 38])
      h['December'] = [160, 80]
      h
    when :E
      h = Hash.new([100, 50])
      h['December'] = [200, 100]
      h
    else
      raise 'Must not happen'
    end
end

# Reserve a contract cancel



def end_month
  @month += 1

  # produce
  production_vol = @factories.select { _2 }.map {|type, employees|
    case type
    when :manual
      employees[:junior] * 20 + employees[:intermediate] * 40 + employees[:senior] * 80
    when :semi
      employees[:junior] * 50 + employees[:intermediate] * 60 + employees[:senior] * 80
    when :full
      employees[:junior] * 80 + employees[:intermediate] * 80 + employees[:senior] * 80
    when :idle
      0
    else
      raise 'Must not happen'
    end
  }.sum
  if @ingredient * 2 < production_vol
    production_vol = @ingredient * 2
  end

  @ingredient -= production_vol / 2

  if @ingredient + @product + production_vol <= @storage
    # good
  else
    # pay penalty
    @money -= 100 * (@ingredient + @product + production_vol - @storage)
    production_vol = @storage - @product - @ingredient
  end
  
  @product += production_vol

  # gain sales
  @contracts.each do |contract|
    (required_products, fee) = contract[current_month]
    if required_products <= @product
      # good
      @product -= required_products
      @money += fee
    else
      # penalty
      @money -= fee * 10
    end
  end

  # pay fees
  @money -= @storage / 100
  @money -= @factories.values.compact.map {|employees|
    employees[:junior] * 3 + employees[:intermediate] * 5 + employees[:senior] * 9
  }.sum

  if @money < 0
    puts 'Game over'
  elsif 1000 <= @money
    puts "Game clear! #{month}"
  else
    status()
  end
end

start()
buy_storage()
buy_ingredient()
buy_ingredient()
buy_factory(:manual)
hire(:junior)
dispatch(:junior, :idle, :manual)
hire(:intermediate)
dispatch(:intermediate, :idle, :manual)
contract(:A)
end_month()

buy_ingredient()
end_month()

buy_ingredient()
end_month()

buy_ingredient()
end_month()

buy_ingredient()
end_month()

buy_ingredient()
end_month()
