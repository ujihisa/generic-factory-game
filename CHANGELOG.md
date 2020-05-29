## 1.0.0

* User authentication
* Rebalanced gameplay
    * Sales payments occur in 3 months.
        * e.g. Sales payment for Nov 2020 occurs in Feb 2021.
    * SubscribeIngredient
        * 20 credit -> 10 credit
        * $1 for 20t -> $1 for 10t
    * Employees
        * Bare product quality changes
            * Junior: 20 -> 10
            * Intermediate: 20 -> 10
            * Senior: 40 -> 20
    * Contracts
        * Less product volume contracts tend to be high sales performance
        * It's harder to fullfill minimal credit for better contracts
* Factory equipments may "deprecate" older version
    * When you buy an equipment, it may remove an older version of it
    * You can skip older version if you want
    * e.g. "Fullauto machines" deprecates "Semiauto machines"
        * If you buy "Fullauto machines", you can't buy "Semiauto machines"
        * If you already have "Semiauto machines", buying "Fullauto machines" removes "Semiauto machines"
            * After you get "Fullauto machines", you don't have to pay monthly cost of "Semiauto machines", since it doesn't exist now
* Ingredient overflow costs $1 for 5t
* SubscribeIngredient change fee applies also when you reduce the subscription volume
* Added "Easy mode"
* UIs
    * Factory equipments now have images

## 1.0.0-preview

* Introduced these new concepts
    * Credit
    * Bank (cash and debt)
    * Factory equipments
    * Ingredient subscription
    * Product/production quality
    * Tutorial
* Rebalanced gameplay
    * Feedback: it's too hard
* Started recording portfolio for visualizing in the future
    * Implemented cash/debt chart
