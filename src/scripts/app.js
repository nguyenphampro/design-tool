var app = angular.module('canhCamApp', ['ui.bootstrap']);
// Filter 
app.filter('html', ['$sce', function ($sce) {
	return function (val) {
		return $sce.trustAsHtml(val);
	};
}])
// Main Controller
app.controller('mainControl', function ($scope, $http) {
	$scope.showloading = false
	$scope.materials = []
	$scope.showloadingmaterial = false

	$scope.lang = {
		loading: 'Đang tải dữ liệu...',
		noitem: 'Không có danh mục nào cả!',
		notice: 'Vui lòng chọn danh mục bên cạnh để thực hiện phối màu',
		material: 'Danh mục chất liệu'
	}
	$http({
		method: 'GET',
		url: baoNguyenApp.API.main
	}).then(function (response) {
		$scope.data = eval(response.data.settings);
	}, function (error) {
		console.log('Lỗi Data: ' + error);
	});
	$scope.setPattern = function (e) {
		doSetMaterial(e, $scope, $http)
	}
});
// Child Controller
app.controller('getMenuMaterial', function ($scope, $http) {
	$http({
		method: 'GET',
		url: baoNguyenApp.API.menu
	}).then(function (response) {
		$scope.menus = eval(response.data.menu);
		$scope.ctrlClickHandler = function (e) {
			getMaterial($scope, $http)
		}
	}, function (error) {
		console.log('Lỗi Menu: ' + error);
	});
});

function getMaterial($scope, $http) {
	// Phân trang
	$scope.lists = []
	$scope.viewby = 12;
	$scope.currentPage = 1;
	$scope.itemsPerPage = $scope.viewby;
	$scope.maxSize = 3;
	$scope.select = [
		{id: 12, name: '12'},
		{id: 20, name: '20'},
		{id: 24, name: '24'},
		{id: 40, name: '40'},
		{id: 48, name: '48'}
	 ];
	$scope.viewby = $scope.select[0];
	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};
	$scope.pageChanged = function () {
		$scope.lists = $scope.materials.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage))
		setTimeout(() => {
			materialHeight()
		}, 100);
	};
	$scope.setItemsPerPage = function (num) {
		$scope.itemsPerPage = num.id;
		$scope.currentPage = 1; 
		$scope.lists = $scope.materials.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage))
		setTimeout(() => {
			materialHeight()
		}, 100);
	}
	// Phân trang
	$scope.showloading = true
	$http({
		method: 'GET',
		url: baoNguyenApp.API.material
	}).then(function (response) {
		$scope.materials = eval(response.data.lists);
		// Phân trang
		$scope.totalItems = response.data.lists.length;
		$scope.lists = $scope.materials.slice((($scope.currentPage-1)*$scope.itemsPerPage), (($scope.currentPage)*$scope.itemsPerPage))
		// Phân trang
		if ($scope.materials.length > 0) {
			setTimeout(() => {
				materialHeight()
			}, 100);
		}
		$scope.showloading = false
	}, function (error) {
		console.log('Lỗi Material: ' + error);
	});
}

function doSetMaterial(e, $scope, $http) {
	$scope.showloadingmaterial = true
	$http({
		method: 'GET',
		url: baoNguyenApp.API.material
	}).then(function (response) {
		$scope.dataset = e
		$('.apply-content').html(e.name)
		$scope.showloadingmaterial = false
	}, function (error) {
		console.log('Lỗi setData: ' + error);
	});
}