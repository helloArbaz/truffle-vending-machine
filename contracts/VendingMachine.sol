// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract VendingMachine {

    // struct config
    struct ProductDetails {
        string _itemName;
        string _price;
        uint _unit;
    }
    struct Product {
        string _category;
        ProductDetails _prdDetails;
    }


    // Events
    event Purchased(address _to, uint _amount);
    event StockUP(uint _lastUnit, uint _maxUnit, uint _totalStock);

    
    //
    mapping(address=>uint) _vmBalance;
    address  public _owner;
    Product[] public _products;
    string[3][] _productListStech;
    string[] _masterProducts;
  

    function defaultStockUp() private {
    _productListStech.push(["Drink","Sprite","50"]);
    _productListStech.push(["Drink","Fanta","50"]);
    _productListStech.push(["Drink","7Up","50"]);
    _productListStech.push(["Drink","Energy","50"]);
    _productListStech.push(["Chips","Lays","20"]);
    _productListStech.push(["Chips","Doritos","20"]);
    _productListStech.push(["Chips","Chips","20"]);
    _productListStech.push(["Chips","Bingo","20"]);
    _productListStech.push(["Chocolate","KitKat","20"]);
    _productListStech.push(["Chocolate","Amul","50"]);
    _productListStech.push(["Chocolate","Mars","50"]);
    _productListStech.push(["Chocolate","Perk","50"]);
    _productListStech.push(["Noodles","Maggi","50"]);
    _productListStech.push(["Noodles","Yepi","50"]);

        for(uint i = 0 ; i < _productListStech.length; i++ ){
            Product memory pro = Product(
                {
                    _category:_productListStech[i][0],
                    _prdDetails:ProductDetails(
                        _productListStech[i][1],
                        _productListStech[i][2],
                        100
                    )}
                );
            _products.push(pro);
        }
    }

    modifier checkOwner() {
        require(msg.sender == _owner,"Access Not Allowed");
        _;
    }

    // add _maxUnit in all the products
    function stockUp(uint _maxUnit)  public checkOwner   {
         Product[] storage pod = _products;
        for(uint i = 0 ; i < _products.length; i++){
            pod[i]._prdDetails._unit +=_maxUnit;
        }
    } 

    constructor() public{
        _owner= msg.sender;
        defaultStockUp();
        _vmBalance[msg.sender] = 100;
    }

    function getProduts() public view returns(Product[] memory){
        return _products;
    }

    function purchaseItem(uint _parentIndex, uint _amount)  public{
        Product[] storage pod = _products;
        pod[_parentIndex]._prdDetails._unit--;
        _vmBalance[_owner] += _amount;
        emit Purchased(_owner,_amount);
    }

    function getVmBalance() public view returns(uint){
        return _vmBalance[_owner];
    }

    function getProductCount() public view returns(uint) {
        return _products.length;
    }

    function getMasterProducts() public view returns(string[] memory) {
        return _masterProducts;
    }
}