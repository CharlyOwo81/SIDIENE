  // src/components/UpdateIncidents.tsx
  import React, { useState, useEffect } from 'react';
  import { motion } from 'framer-motion';
  import Modal from "./Modal";
  import GoBackButton from "../../assets/components/Button/GoBackButton";
  import styles from "../ManageIncidents/CreateIncidents/CreateIncidents.module.css";
  import Label from "../../assets/components/Label/Label";
  import InputField from "../../assets/components/InputField/InputField";
  import SelectField from "../../assets/components/SelectField/SelectField";
  import Button from "../../assets/components/Button/Button";
  import { motivosPorSeveridad } from "../../constants/incidenceOptions";
  import axios from 'axios';

  type NivelSeveridad = keyof typeof motivosPorSeveridad;

  interface Incident {
    id_incidencia: string;
    fecha: string;
    nivel_severidad: NivelSeveridad;
    motivo: string;
    descripcion: string;
    estudiante: {
      curp: string;
      nombres: string;
      apellidoPaterno: string;
      apellidoMaterno: string;
      grado: string;
      grupo: string;
    };
  }

  const UpdateIncidents: React.FC = () => {
    const [searchFilters, setSearchFilters] = useState({
      fecha: '',
      nombre: '',
      severidad: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);

  // En el handleSearch, verificar la respuesta
    const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validar que al menos un filtro esté presente
      if (!searchFilters.fecha && !searchFilters.nombre && !searchFilters.severidad) {
        alert('Por favor ingresa al menos un criterio de búsqueda');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get('/api/incidences', {
          params: searchFilters
        });
        
        // Actualizar la condición de validación
        if (response.status === 200 && Array.isArray(response.data)) {
          setIncidents(response.data);
          setFilteredIncidents(response.data);
          setShowResultsModal(true);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('Error searching incidents:', error);
        if (axios.isAxiosError(error)) {
          alert(error.response?.data?.message || 'Error al buscar incidencias');
        } else {
          alert('Error al buscar incidencias');
        }
      } finally {
        setLoading(false);
      }
    };

    const handleModalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value.toLowerCase();
      setSearchTerm(term);
      const filtered = incidents.filter(incident =>
        incident.estudiante.nombres.toLowerCase().includes(term) ||
        incident.estudiante.apellidoPaterno.toLowerCase().includes(term) ||
        incident.motivo.toLowerCase().includes(term)
      );
      setFilteredIncidents(filtered);
    };

    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedIncident) return;

      setIsSubmitting(true);
      try {
        await axios.put(`/api/incidents/${selectedIncident.id_incidencia}`, {
          fecha: selectedIncident.fecha,
          nivel_severidad: selectedIncident.nivel_severidad,
          motivo: selectedIncident.motivo,
          descripcion: selectedIncident.descripcion
        });
        
        // Actualizar lista de incidentes
        const updatedIncidents = incidents.map(inc => 
          inc.id_incidencia === selectedIncident.id_incidencia ? selectedIncident : inc
        );
        setIncidents(updatedIncidents);
        
        alert('Incidencia actualizada exitosamente!');
      } catch (error) {
        console.error('Error updating incident:', error);
        alert('Error actualizando la incidencia');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.formContainer}
      >
        {/* Formulario de Búsqueda */}
        <div className={styles.section}>
          <h2 className={styles.formTitle}>Buscar Incidencias</h2>
          <form onSubmit={handleSearch} className={styles.form}>
            <div className={styles.grid}>
              <div className={styles.inputWrapper}>
                <Label htmlFor="fecha">Fecha</Label>
                <InputField
                                type="date"
                                name="fecha"
                                value={searchFilters.fecha}
                                onChange={(e) => setSearchFilters({ ...searchFilters, fecha: e.target.value })} placeholder={''}              />
              </div>
              
              <div className={styles.inputWrapper}>
                <Label htmlFor="nombre">Nombre del Estudiante</Label>
                <InputField
                  type="text"
                  name="nombre"
                  placeholder="Buscar por nombre"
                  value={searchFilters.nombre}
                  onChange={(e) => setSearchFilters({...searchFilters, nombre: e.target.value})}
                />
              </div>
              
              <div className={styles.inputWrapper}>
                <Label htmlFor="severidad">Nivel de Severidad</Label>
                <SelectField
                  name="severidad"
                  value={searchFilters.severidad}
                  options={[
                    { value: '', label: 'Todos' },
                    ...Object.keys(motivosPorSeveridad).map(severidad => ({
                      value: severidad,
                      label: severidad
                    }))
                  ]}
                  onChange={(e) => setSearchFilters({...searchFilters, severidad: e.target.value})}
                />
              </div>
              
              <div className={styles.inputWrapper}>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar Incidencias'}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Modal de Resultados */}
        <Modal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          title="Resultados de Búsqueda"
        >
          <div className={styles.modalContent}>
            <div className={styles.searchBar}>
              <InputField
                            type="text"
                            placeholder="Buscar en resultados..."
                            value={searchTerm}
                            onChange={handleModalSearch} name={'Buscar'}            />
            </div>
            
            <div className={styles.resultsList}>
              {filteredIncidents.map(incident => (
                <div
                  key={incident.id_incidencia}
                  className={`${styles.resultItem} ${selectedIncident?.id_incidencia === incident.id_incidencia ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedIncident(incident);
                    setShowResultsModal(false);
                  }}
                >
                  <div className={styles.resultDate}>
                    {new Date(incident.fecha).toLocaleDateString()}
                  </div>
                  <div className={styles.resultName}>
                    {incident.estudiante.nombres} {incident.estudiante.apellidoPaterno}
                  </div>
                  <div className={styles.resultSeverity}>
                    {incident.nivel_severidad}
                  </div>
                  <div className={styles.resultMotivo}>
                    {incident.motivo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        {/* Formulario de Edición */}
        {selectedIncident && (
          <div className={styles.section}>
            <h2 className={styles.formTitle}>Editar Incidencia</h2>
            <form onSubmit={handleUpdate} className={styles.form}>
              <div className={styles.grid}>
                <div className={styles.inputWrapper}>
                  <Label htmlFor="fecha">Fecha</Label>
                  <InputField
                                    type="date"
                                    name="fecha"
                                    value={selectedIncident.fecha}
                                    onChange={(e) => setSelectedIncident({
                                        ...selectedIncident,
                                        fecha: e.target.value
                                    })} placeholder={''}                />
                </div>
                
                <div className={styles.inputWrapper}>
                  <Label htmlFor="nivel_severidad">Nivel de Severidad</Label>
                  <SelectField
                    name="nivel_severidad"
                    value={selectedIncident.nivel_severidad}
                    options={Object.keys(motivosPorSeveridad).map(severidad => ({
                      value: severidad,
                      label: severidad
                    }))}
                    onChange={(e) => setSelectedIncident({
                      ...selectedIncident,
                      nivel_severidad: e.target.value as NivelSeveridad,
                      motivo: ""
                    })}
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <Label htmlFor="motivo">Motivo</Label>
                    <SelectField
                      name="motivo"
                      value={selectedIncident.motivo}
                      options={[
                        { value: '', label: 'Seleccionar motivo' },
                        ...(motivosPorSeveridad[selectedIncident.nivel_severidad] || []).map(motivo => ({
                          value: motivo,
                          label: motivo
                        }))
                      ]}
                      onChange={(e) => setSelectedIncident({
                        ...selectedIncident,
                        motivo: e.target.value
                      })}
                    />
                </div>

                <div className={styles.inputWrapper}>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <textarea
                    value={selectedIncident.descripcion}
                    onChange={(e) => setSelectedIncident({
                      ...selectedIncident,
                      descripcion: e.target.value
                    })}
                    className={styles.textarea}
                  />
                </div>
              </div>

              <div className={styles.buttonContainer}>
                <Button 
                  type="button" 
                  onClick={() => setSelectedIncident(null)}

                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    );
  };

  export default UpdateIncidents;