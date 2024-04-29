# Shopping Cart

A TDD practice exercise suggested by Jason Gorman in his book on the subject - Codemanship - TDD.

## Instructions

Test-drive some code that will calculate the total net value of items in a shopping cart represented as a list of unit price and quantity - e.g. {{10.0, 5}, {25.5, 2}}, with the following discounts applied:

1. If total gross value > £100, apply a 5% discount
2. If total gross value > £200, apply a 10% discount

## Test list

~~_Add single item to the cart_~~

~~_Add multiple quantities of a single item to the cart_~~

~~_Add two different items with different quantities to the cart_~~

~~_Get gross value for single item in the cart_~~

~~_Get gross value of multiple single items in the cart_~~

~~_Get gross value for two different items with different quantities in the cart_~~

~~_Get total gross value with unit prices of varying decimal values_~~

~~_Get total gross value_~~

~~_Get total net value_~~

~~_Apply 5% discount if total gross value is over £100_~~

~~_Don't apply 5% discount if total gross value is equal to £100_~~

~~_Apply 10% discount if total gross value is over £200_~~

~~_Apply 5% discount (not 10%) if total gross value is equal to £200_~~

~~_Get '£0.00' as gross value if cart is empty_~~

~~_Get '£0.00' as net value if cart is empty_~~

## Expanding on above requirements

~~_Extend currency formatter to use different currencies_~~

~~_Write receipt to text file_~~

~~_Write receipt to JSON file_~~

~~_Write receipt to HTML file_~~

~~_Let items have an id_~~

Let items have a name

Let items have a description

Let items have an image url

Remove a single item from the cart

Remove multiple items from the cart
