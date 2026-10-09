# UpdateServiceDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Nombre del servicio | [optional] [default to undefined]
**categoryId** | **number** | ID de la categoría | [optional] [default to undefined]
**description** | **string** | Descripción | [optional] [default to undefined]
**price** | **number** | Precio | [optional] [default to undefined]
**duration** | **number** | Duración en minutos | [optional] [default to undefined]
**prepTime** | **number** | Tiempo de preparación en minutos | [optional] [default to undefined]
**isActive** | **boolean** | Si está activo | [optional] [default to undefined]
**allowConcurrent** | **boolean** | Permite servicios simultáneos (ej. durante secado/procesamiento) | [optional] [default to undefined]

## Example

```typescript
import { UpdateServiceDto } from './api';

const instance: UpdateServiceDto = {
    name,
    categoryId,
    description,
    price,
    duration,
    prepTime,
    isActive,
    allowConcurrent,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
