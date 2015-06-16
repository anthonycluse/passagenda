var app = angular.module("GestiawebApp", []);

app.controller("OrderController", function($scope, $http) {
  var choosingProducts = [];
  $scope.quantityDesired = 1;
  
  // on récupère la liste des clients
  $http.get('/api/eccustomer').success(function(data, status, headers, config) {
    $scope.customers = data;
  });

  // on récupère la liste des produits
  $http.get('/api/ecproduct').success(function(data, status, headers, config) {
    $scope.products = data;
  });

  // on récupère le nouvel id de la commande
  $http.get('/api/ecorder').success(function(data, status, headers, config) {
    var newOrderId;
    if (data.length >= 1 ) {
      newOrderId = data[0].id + 1;
    } else {
      newOrderId = data.length + 1;
    }
    $scope.newOrderId = newOrderId;
  });

  // ajout d'un client dans le panier
  $scope.chooseCustomer = function(customer){
    $scope.choosingCustomer = customer;
  };

  // ajout d'un produit dans le panier
  $scope.addProduct = function(product){
    product.quantityDesired = $scope.quantityDesired;
    product.EcOrderId = $scope.newOrderId;
    choosingProducts.push(product);
    $scope.choosingProducts = choosingProducts;
  };

  // calcul du tota du panier
  $scope.getTotal = function(){
    var total = 0;
    for (var i = 0; i < choosingProducts.length; i++) {
      total += choosingProducts[i].price * choosingProducts[i].quantityDesired;
    }
    return total;
  };

  // on enregistre la nouvel commande
  $scope.saveOrder = function() {
    // on enregistre la commande dans la table EcOrder
    var csrf = $('input[name="_csrf"]').val();
    $http.post('/ecorder/create', {
      _csrf: csrf,
      order: {
        EcCustomerId: $scope.choosingCustomer.id
      }
    }).success(function(data, status, headers, config) {
      // on ajoute chaque produit lié au clients dans la table orderProduct
      choosingProducts.forEach( function(product){
        $http.post('/ecorderproduct/create', {
          _csrf: csrf,
          orderProduct: {
            quantity: product.quantityDesired,
            EcProductId: product.id,
            EcOrderId: product.EcOrderId
          }
        }).success(function(data, status, headers, config) {
          document.location.href = '/ecorder/_index';
        }).error(function(data, status, headers, config) {
          console.log(data, status, headers, config);
        });
      });
    }).error(function(data, status, headers, config) {
      document.location.href = '/ecorder/new';
    });
  }
});