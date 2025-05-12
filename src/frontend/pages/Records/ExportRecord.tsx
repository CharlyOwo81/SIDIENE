import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExpedienteService, Expediente } from '../../../backend/services/expedienteService';
import SelectField from '../../assets/components/SelectField/SelectField';
import Label from '../../assets/components/Label/Label';
import Navbar from '../../assets/components/Navbar/Navbar';
import Alert from '../../assets/components/Alert/Alert';
import styles from './ManageExpedientes.module.css';

const ExportRecord = () => {
  const [filters, setFilters] = useState({ grade: '', group: '' });
  const [students, setStudents] = useState<
    Array<{ curp: string; nombres: string; apellido_paterno: string; apellido_materno: string }>
  >([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (filters.grade && filters.group) {
        setLoading(true);
        setAlert(null);
        try {
          const response = await ExpedienteService.getStudentsWithExpediente(filters.grade, filters.group);
          console.log('Students response:', response);
          if (response.success) {
            setStudents(response.data || []);
            setSelectedStudents([]);
          } else {
            setAlert({ message: response.message || 'Error al cargar estudiantes', type: 'error' });
            setStudents([]);
          }
        } catch (error) {
          setAlert({ message: 'Error de conexión al cargar estudiantes', type: 'error' });
          setStudents([]);
        } finally {
          setLoading(false);
        }
      } else {
        setStudents([]);
        setSelectedStudents([]);
      }
    };
    fetchStudents();
  }, [filters.grade, filters.group]);

  const generatePDF = async () => {
    setLoading(true);
    setAlert(null);

    if (selectedStudents.length === 0) {
      setAlert({ message: 'Selecciona al menos un estudiante', type: 'warning' });
      setLoading(false);
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const margin = 15;
    let yPosition = margin;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Colors
    const colors = {
      primary: '#2c3e50',
      secondary: '#3498db',
      accent: '#e74c3c'
    };

    // School logo (base64 or URL)
    const logo = 'data:image/png;base64,...'; // Add your logo in base64

    for (const [index, curp] of selectedStudents.entries()) {
      if (index > 0) {
        doc.addPage();
        yPosition = margin;
      }

      try {
        const expediente = await ExpedienteService.getByStudent(curp);
        const student = students.find(s => s.curp === curp);

        if (!student || !expediente) {
          throw new Error('Datos incompletos para el estudiante');
        }

        // Header
        if (logo) {
          doc.addImage(logo, 'PNG', margin, yPosition, 40, 40);
        }
        yPosition += 45;

        // Student information
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(colors.primary);
        doc.text('Expediente Estudiantil', margin, yPosition);
        
        doc.setFontSize(12);
        doc.setTextColor(colors.secondary);
        yPosition += 10;
        doc.text(`Estudiante: ${student.nombres} ${student.apellido_paterno}`, margin, yPosition);
        yPosition += 8;
        doc.text(`CURP: ${curp}`, margin, yPosition);
        yPosition += 8;
        doc.text(`Grado y Grupo: ${filters.grade}° ${filters.group}`, margin, yPosition);
        yPosition += 15;

        // Incidents history
        doc.setFontSize(14);
        doc.setTextColor(colors.primary);
        doc.text('Historial de Incidencias:', margin, yPosition);
        yPosition += 10;

        if (expediente.incidencias.length === 0) {
          doc.setFontSize(12);
          doc.setTextColor(colors.accent);
          doc.text('No se registran incidencias', margin, yPosition);
          yPosition += 10;
        } else {
          expediente.incidencias.forEach((incidencia, idx) => {
            doc.setFontSize(12);
            doc.setTextColor(colors.primary);
            doc.text(`Incidencia #${idx + 1}:`, margin, yPosition);
            yPosition += 8;

            const incidentData = [
              ['Fecha:', new Date(incidencia.fecha).toLocaleDateString('es-MX')],
              ['Motivo:', incidencia.motivo],
              ['Nivel de Severidad:', incidencia.nivel_severidad],
              ['Descripción:', incidencia.descripcion]
            ];

            // Incidents table
            (doc as any).autoTable({
              startY: yPosition,
              head: [['Campo', 'Detalle']],
              body: incidentData,
              theme: 'grid',
              styles: { 
                fontSize: 10,
                cellPadding: 3,
                textColor: colors.primary
              },
              headStyles: {
                fillColor: colors.secondary,
                textColor: 255
              }
            });

            yPosition = (doc as any).lastAutoTable.finalY + 10;

            if (incidencia.acuerdos.length > 0) {
              doc.setFontSize(12);
              doc.setTextColor(colors.primary);
              doc.text('Acuerdos Relacionados:', margin, yPosition);
              yPosition += 8;

              const agreementData = incidencia.acuerdos.map(acuerdo => [
                new Date(acuerdo.fecha_creacion).toLocaleDateString('es-MX'),
                acuerdo.descripcion,
                acuerdo.estatus
              ]);

              (doc as any).autoTable({
                startY: yPosition,
                head: [['Fecha', 'Descripción', 'Estatus']],
                body: agreementData,
                theme: 'grid',
                styles: { 
                  fontSize: 10,
                  cellPadding: 3,
                  textColor: colors.primary
                },
                headStyles: {
                  fillColor: colors.accent,
                  textColor: 255
                }
              });

              yPosition = (doc as any).lastAutoTable.finalY + 10;
            }
          });
        }

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generado el: ${new Date().toLocaleDateString('es-MX')} - Sistema de Gestión Escolar`, 
          margin, doc.internal.pageSize.getHeight() - 10);
      } catch (error) {
        console.error(`Error processing student ${curp}:`, error);
      }
    }

    doc.save(`expedientes_${new Date().toISOString().slice(0,10)}.pdf`);
    setAlert({ message: 'PDF generado exitosamente', type: 'success' });
    setLoading(false);
  };

  const gradeOptions = [
    { value: '', label: 'Seleccionar grado' },
    { value: '1', label: '1°' },
    { value: '2', label: '2°' },
    { value: '3', label: '3°' },
  ];

  const groupOptions = [
    { value: '', label: 'Seleccionar grupo' },
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={styles.mainContainer}
    >
      <Navbar
        title="Exportar Expedientes"
        buttons={[
          { label: 'Exportar', icon: '📤', path: '/ExportRecord' },
          { label: 'Consultar', icon: '🔍', path: '/ViewRecord' },
          { label: 'Regresar', icon: '↩️', path: '/' },
        ]}
      />

      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.alertContainer}
        >
          <Alert {...alert} onClose={() => setAlert(null)} />
        </motion.div>
      )}

      <div className={styles.formContainer}>
        <h1 className={styles.formTitle}>Exportar Expedientes a PDF</h1>

        <div className={styles.filterSection}>
          <Label className={styles.label}>Grado</Label>
          <SelectField
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value, group: '' })}
            options={gradeOptions}
            required
          />
          <Label className={styles.label}>Grupo</Label>
          <SelectField
            value={filters.group}
            onChange={(e) => setFilters({ ...filters, group: e.target.value })}
            options={groupOptions}
            disabled={!filters.grade}
            required
          />
        </div>

        {loading && (
          <div className={styles.loading}>
            <span className={styles.spinner}></span> Cargando estudiantes...
          </div>
        )}

        {!loading && students.length === 0 && filters.grade && filters.group && (
          <div className={styles.emptyState}>No hay estudiantes en este grado y grupo.</div>
        )}

        {!loading && students.length > 0 && (
          <div className={styles.studentList}>
            {students.map((student) => (
              <div key={student.curp} className={styles.studentItem}>
                <label className={styles.studentLabel}>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.curp)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents([...selectedStudents, student.curp]);
                      } else {
                        setSelectedStudents(selectedStudents.filter((c) => c !== student.curp));
                      }
                    }}
                    className={styles.studentCheckbox}
                  />
                  <span>{`${student.nombres} ${student.apellido_paterno} ${student.apellido_materno || ''}`}</span>
                </label>
              </div>
            ))}
          </div>
        )}

        <button
          className={styles.exportButton}
          onClick={generatePDF}
          disabled={selectedStudents.length === 0 || loading}
        >
          {loading ? 'Generando PDF...' : 'Exportar Selección'}
        </button>
      </div>
    </motion.section>
  );
};

export default ExportRecord;