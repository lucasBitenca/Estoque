(function () {
    'use strict';

    angular
        .module('app')
        .controller('Estoque.IndexController', Controller);

    function Controller($window, EstoqueService, FlashService) {
        var vm = this;

        vm.estoque = null;
        vm.saveEstoque = saveEstoque;
        vm.deleteEstoque = deleteEstoque;

        initController();

        function initController() {
            // get current estoque
            EstoqueService.GetCurrent().then(function (estoque) {
                vm.estoque = estoque;
            });
        }

        function saveEstoque() {
            EstoqueService.Update(vm.Estoque)
                .then(function () {
                    FlashService.Success('Estoque updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteEstoque() {
            EstoqueService.Delete(vm.estoque._id)
                .then(function () {
                    // log estoque out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();