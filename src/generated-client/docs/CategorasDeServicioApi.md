# CategorasDeServicioApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**serviceCategoryControllerCreate**](#servicecategorycontrollercreate) | **POST** /service-categories | Crear categoría|
|[**serviceCategoryControllerFindAll**](#servicecategorycontrollerfindall) | **GET** /service-categories | Listar categorías de servicio|
|[**serviceCategoryControllerFindOne**](#servicecategorycontrollerfindone) | **GET** /service-categories/{id} | Obtener categoría por ID|
|[**serviceCategoryControllerRemove**](#servicecategorycontrollerremove) | **DELETE** /service-categories/{id} | Eliminar categoría|
|[**serviceCategoryControllerUpdate**](#servicecategorycontrollerupdate) | **PUT** /service-categories/{id} | Actualizar categoría|

# **serviceCategoryControllerCreate**
> ServiceCategoryResponseDto serviceCategoryControllerCreate(createServiceCategoryDto)


### Example

```typescript
import {
    CategorasDeServicioApi,
    Configuration,
    CreateServiceCategoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CategorasDeServicioApi(configuration);

let createServiceCategoryDto: CreateServiceCategoryDto; //

const { status, data } = await apiInstance.serviceCategoryControllerCreate(
    createServiceCategoryDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createServiceCategoryDto** | **CreateServiceCategoryDto**|  | |


### Return type

**ServiceCategoryResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **serviceCategoryControllerFindAll**
> Array<ServiceCategoryResponseDto> serviceCategoryControllerFindAll()


### Example

```typescript
import {
    CategorasDeServicioApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategorasDeServicioApi(configuration);

const { status, data } = await apiInstance.serviceCategoryControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ServiceCategoryResponseDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **serviceCategoryControllerFindOne**
> ServiceCategoryResponseDto serviceCategoryControllerFindOne()


### Example

```typescript
import {
    CategorasDeServicioApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategorasDeServicioApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.serviceCategoryControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ServiceCategoryResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **serviceCategoryControllerRemove**
> serviceCategoryControllerRemove()


### Example

```typescript
import {
    CategorasDeServicioApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategorasDeServicioApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.serviceCategoryControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Categoría eliminada |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **serviceCategoryControllerUpdate**
> ServiceCategoryResponseDto serviceCategoryControllerUpdate(updateServiceCategoryDto)


### Example

```typescript
import {
    CategorasDeServicioApi,
    Configuration,
    UpdateServiceCategoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CategorasDeServicioApi(configuration);

let id: number; // (default to undefined)
let updateServiceCategoryDto: UpdateServiceCategoryDto; //

const { status, data } = await apiInstance.serviceCategoryControllerUpdate(
    id,
    updateServiceCategoryDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateServiceCategoryDto** | **UpdateServiceCategoryDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ServiceCategoryResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

