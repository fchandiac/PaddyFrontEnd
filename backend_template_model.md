## Entidades Backend para el Sistema de Plantillas

### 1. Entidad Principal: DiscountTemplate

```typescript
// Entidad principal para las plantillas de descuento
@Entity()
export class DiscountTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  useToleranceGroup: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  groupToleranceValue: number;

  @Column()
  isDefault: boolean;

  @ManyToOne(() => Producer, (producer) => producer.discountTemplates)
  @JoinColumn({ name: 'producerId' })
  producer: Producer;

  @Column()
  producerId: number;

  @OneToMany(() => TemplateParameter, (param) => param.template, { 
    cascade: true,
    eager: true 
  })
  parameters: TemplateParameter[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

### 2. Entidad para Parámetros de Plantilla: TemplateParameter

```typescript
@Entity()
export class TemplateParameter {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DiscountTemplate, (template) => template.parameters)
  @JoinColumn({ name: 'templateId' })
  template: DiscountTemplate;

  @Column()
  templateId: number;

  @Column()
  parameterKey: string; // "Humedad", "GranosVerdes", etc.

  @Column()
  available: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  percent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tolerance: number;

  @Column()
  showTolerance: boolean;

  @Column()
  groupTolerance: boolean;
}
```

### 3. Entidad para Rangos de Parámetros (opcional)

```typescript
@Entity()
export class ParameterRange {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TemplateParameter)
  @JoinColumn({ name: 'paramId' })
  parameter: TemplateParameter;

  @Column()
  paramId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  start: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  end: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  percent: number;
}
```

### 4. Relación con Entidad Producer

```typescript
@Entity()
export class Producer {
  // Campos existentes...

  @OneToMany(() => DiscountTemplate, (template) => template.producer)
  discountTemplates: DiscountTemplate[];
}
```

## API Endpoints Recomendados

### Templates
- `GET /api/discount-templates` - Listar todas las plantillas
- `GET /api/discount-templates/:id` - Obtener una plantilla específica
- `GET /api/discount-templates/producer/:producerId` - Listar plantillas por productor
- `GET /api/discount-templates/default` - Obtener la plantilla predeterminada
- `POST /api/discount-templates` - Crear nueva plantilla
- `PUT /api/discount-templates/:id` - Actualizar plantilla existente
- `DELETE /api/discount-templates/:id` - Eliminar plantilla
- `PATCH /api/discount-templates/:id/set-default` - Establecer como predeterminada

### Parámetros
- `GET /api/discount-templates/:id/parameters` - Listar parámetros de una plantilla
- `POST /api/discount-templates/:id/parameters` - Añadir parámetro a plantilla
- `PUT /api/discount-templates/:id/parameters/:paramId` - Actualizar parámetro
- `DELETE /api/discount-templates/:id/parameters/:paramId` - Eliminar parámetro

## Consideraciones Adicionales

1. **Soft Delete**: Implementar eliminación lógica para mantener integridad histórica.
2. **Validación**: Asegurar que los valores de porcentaje y tolerancia sean válidos.
3. **Migración de Datos**: Si ya existen plantillas, crear scripts para migrar datos.
4. **Transacciones**: Usar transacciones para operaciones que involucren múltiples entidades.
5. **DTOs**: Crear DTOs específicos para operaciones de creación y actualización.
