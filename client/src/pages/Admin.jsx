import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { partiesApi } from "../api/partiesApi";
import { supabase } from "../api/supabaseClient";
import {
  ArrowLeft,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Save,
  LogOut,
  Shield,
  BarChart3,
  Users,
  TrendingUp,
  Award,
  Activity,
  X,
  Upload,
  Image as ImageIcon,
  FileSpreadsheet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ResultsChart from "../components/admin/ResultsChart";

const SYMBOLS = ["sol", "agua", "tierra", "aire", "fuego", "estrella"];
const PARTY_COLORS = ["#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#14B8A6"];

export default function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddParty, setShowAddParty] = useState(false);
  const [newParty, setNewParty] = useState({
    name: "",
    symbol: "sol",
    color: PARTY_COLORS[0],
    description: "",
    slogan: "",
    logo_url: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const { data: parties = [], isLoading } = useQuery({
    queryKey: ["parties"],
    queryFn: partiesApi.getAll,
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }

      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogoToSupabase = async (file) => {
    try {
      setUploadingLogo(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('party-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('party-logos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      let errorMessage = 'Error al subir la imagen: ';
      
      if (error.message.includes('row-level security')) {
        errorMessage += 'El bucket no tiene las políticas de seguridad correctas.';
      } else if (error.message.includes('not found')) {
        errorMessage += 'El bucket "party-logos" no existe.';
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  const exportToExcel = async () => {
    try {
      // Cargar ExcelJS desde CDN
      if (!window.ExcelJS) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js';
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }
      
      const ExcelJS = window.ExcelJS;
      
      const totalVotes = parties.reduce((sum, p) => sum + p.votes, 0);
      const sortedParties = [...parties].sort((a, b) => b.votes - a.votes);
      const date = new Date().toLocaleDateString('es-PE');
      const timestamp = new Date().toLocaleString('es-PE');
      
      // Crear workbook con metadata profesional
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Sistema Electoral Inka Garsaliso De La Vega';
      workbook.created = new Date();
      workbook.modified = new Date();
      workbook.lastPrinted = new Date();
      workbook.company = 'Colegio Inka Garsaliso De La Vega';
      workbook.subject = 'Resultados Electorales 2025';
      
      // ===== HOJA 1: PORTADA EJECUTIVA =====
      const coverSheet = workbook.addWorksheet('🏆 Portada', {
        properties: { tabColor: { argb: 'FFA78BFA' } },
        views: [{ showGridLines: false }]
      });
      
      coverSheet.columns = Array(8).fill({ width: 15 });
      
      // PORTADA ULTRA PROFESIONAL
      coverSheet.mergeCells('B3:G8');
      const coverTitle = coverSheet.getCell('B3');
      coverTitle.value = '🗳️ RESULTADOS OFICIALES\nELECCIONES ESCOLARES 2025';
      coverTitle.font = { size: 32, bold: true, color: { argb: 'FFFFFFFF' } };
      coverTitle.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      coverTitle.fill = {
        type: 'gradient',
        gradient: 'angle',
        degree: 45,
        stops: [
          { position: 0, color: { argb: 'FFA78BFA' } },
          { position: 0.5, color: { argb: 'FFEC4899' } },
          { position: 1, color: { argb: 'FF60A5FA' } }
        ]
      };
      coverSheet.getRow(3).height = 120;
      
      // Subtítulo institución
      coverSheet.mergeCells('B10:G10');
      const institution = coverSheet.getCell('B10');
      institution.value = '🏛️ COLEGIO INKA GARSALISO DE LA VEGA';
      institution.font = { size: 18, bold: true, color: { argb: 'FF8B5CF6' } };
      institution.alignment = { horizontal: 'center' };
      coverSheet.getRow(10).height = 30;
      
      // Fecha y hora
      coverSheet.mergeCells('B12:G12');
      const dateTime = coverSheet.getCell('B12');
      dateTime.value = `📅 ${timestamp}`;
      dateTime.font = { size: 12, italic: true, color: { argb: 'FF6366F1' } };
      dateTime.alignment = { horizontal: 'center' };
      coverSheet.getRow(12).height = 25;
      
      // Estadísticas destacadas con diseño moderno
      const coverStats = [
        { icon: '📊', label: 'TOTAL DE VOTOS EMITIDOS', value: totalVotes, color: 'FF3B82F6', textColor: 'FFFFFFFF' },
        { icon: '🎯', label: 'PARTIDOS EN COMPETENCIA', value: parties.length, color: 'FF8B5CF6', textColor: 'FFFFFFFF' },
        { icon: '🏆', label: 'PARTIDO GANADOR', value: sortedParties[0]?.name || 'N/A', color: 'FF10B981', textColor: 'FFFFFFFF' },
        { icon: '⚡', label: 'VOTOS DEL GANADOR', value: sortedParties[0]?.votes || 0, color: 'FFF59E0B', textColor: 'FF1F2937' }
      ];
      
      let coverRow = 15;
      coverStats.forEach((stat, idx) => {
        coverSheet.mergeCells(`B${coverRow}:D${coverRow}`);
        const labelCell = coverSheet.getCell(`B${coverRow}`);
        labelCell.value = `${stat.icon} ${stat.label}`;
        labelCell.font = { size: 13, bold: true, color: { argb: stat.textColor } };
        labelCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
        labelCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: stat.color }
        };
        labelCell.border = {
          top: { style: 'medium', color: { argb: stat.color } },
          bottom: { style: 'medium', color: { argb: stat.color } },
          left: { style: 'medium', color: { argb: stat.color } }
        };
        
        coverSheet.mergeCells(`E${coverRow}:G${coverRow}`);
        const valueCell = coverSheet.getCell(`E${coverRow}`);
        valueCell.value = stat.value;
        valueCell.font = { size: 16, bold: true, color: { argb: 'FF1F2937' } };
        valueCell.alignment = { vertical: 'middle', horizontal: 'center' };
        valueCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF3F4F6' }
        };
        valueCell.border = {
          top: { style: 'medium', color: { argb: stat.color } },
          bottom: { style: 'medium', color: { argb: stat.color } },
          right: { style: 'medium', color: { argb: stat.color } }
        };
        
        coverSheet.getRow(coverRow).height = 40;
        coverRow += 2;
      });
      
      // Footer portada
      coverSheet.mergeCells(`B${coverRow + 2}:G${coverRow + 2}`);
      const coverFooter = coverSheet.getCell(`B${coverRow + 2}`);
      coverFooter.value = '✨ Sistema Electoral Seguro y Confiable ✨';
      coverFooter.font = { size: 11, italic: true, color: { argb: 'FF9CA3AF' } };
      coverFooter.alignment = { horizontal: 'center' };
      
      // ===== HOJA 2: RESUMEN EJECUTIVO MEJORADO =====
      const summarySheet = workbook.addWorksheet('📊 Resumen Ejecutivo', {
        properties: { tabColor: { argb: 'FF8B5CF6' } }
      });
      
      summarySheet.columns = [
        { width: 3 },
        { width: 40 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 3 }
      ];
      
      // HEADER PRINCIPAL con diseño gradiente
      summarySheet.mergeCells('B2:E2');
      const headerCell = summarySheet.getCell('B2');
      headerCell.value = '🏛️ SISTEMA ELECTORAL 2025 - RESULTADOS OFICIALES';
      headerCell.font = { size: 22, bold: true, color: { argb: 'FFFFFFFF' } };
      headerCell.alignment = { vertical: 'middle', horizontal: 'center' };
      headerCell.fill = {
        type: 'gradient',
        gradient: 'angle',
        degree: 90,
        stops: [
          { position: 0, color: { argb: 'FF8B5CF6' } },
          { position: 1, color: { argb: 'FFEC4899' } }
        ]
      };
      summarySheet.getRow(2).height = 50;
      
      // Subtítulo elegante
      summarySheet.mergeCells('B3:E3');
      const subtitleCell = summarySheet.getCell('B3');
      subtitleCell.value = 'Inka Garsaliso De La Vega - Elecciones Democráticas Estudiantiles';
      subtitleCell.font = { size: 13, italic: true, color: { argb: 'FF6366F1' } };
      subtitleCell.alignment = { horizontal: 'center' };
      subtitleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF3F4F6' }
      };
      summarySheet.getRow(3).height = 28;
      
      // Fecha y hora detallada
      summarySheet.mergeCells('B4:E4');
      const dateCell = summarySheet.getCell('B4');
      dateCell.value = `📅 Reporte generado: ${timestamp}`;
      dateCell.font = { size: 10, bold: true, color: { argb: 'FF475569' } };
      dateCell.alignment = { horizontal: 'center' };
      dateCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFEF3C7' }
      };
      summarySheet.getRow(4).height = 22;
      
      summarySheet.getRow(5).height = 12;
      
      // PANEL DE ESTADÍSTICAS MEJORADO
      const stats = [
        { icon: '📊', label: 'TOTAL DE VOTOS', value: totalVotes, color: 'FF3B82F6', bgColor: 'FFDBEAFE' },
        { icon: '🎯', label: 'PARTIDOS REGISTRADOS', value: parties.length, color: 'FF8B5CF6', bgColor: 'FFF3E8FF' },
        { icon: '🏆', label: 'PARTIDO LÍDER', value: sortedParties[0]?.name || 'N/A', color: 'FF10B981', bgColor: 'FFD1FAE5' },
        { icon: '📈', label: 'VOTOS DEL LÍDER', value: sortedParties[0]?.votes || 0, color: 'FFF59E0B', bgColor: 'FFFEF3C7' },
        { icon: '📉', label: 'PROMEDIO POR PARTIDO', value: parties.length > 0 ? (totalVotes / parties.length).toFixed(1) : 0, color: 'FFEC4899', bgColor: 'FFFCE7F3' },
        { icon: '💯', label: 'PARTICIPACIÓN', value: '100%', color: 'FF06B6D4', bgColor: 'FFCFFAFE' }
      ];
      
      let row = 6;
      stats.forEach((stat, index) => {
        summarySheet.mergeCells(`B${row}:C${row}`);
        const labelCell = summarySheet.getCell(`B${row}`);
        labelCell.value = `${stat.icon} ${stat.label}`;
        labelCell.font = { size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
        labelCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
        labelCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: stat.color }
        };
        labelCell.border = {
          top: { style: 'medium', color: { argb: stat.color } },
          bottom: { style: 'medium', color: { argb: stat.color } },
          left: { style: 'medium', color: { argb: stat.color } }
        };
        
        summarySheet.mergeCells(`D${row}:E${row}`);
        const valueCell = summarySheet.getCell(`D${row}`);
        valueCell.value = stat.value;
        valueCell.font = { size: 15, bold: true, color: { argb: 'FF1F2937' } };
        valueCell.alignment = { vertical: 'middle', horizontal: 'center' };
        valueCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: stat.bgColor }
        };
        valueCell.border = {
          top: { style: 'medium', color: { argb: stat.color } },
          bottom: { style: 'medium', color: { argb: stat.color } },
          right: { style: 'medium', color: { argb: stat.color } }
        };
        
        summarySheet.getRow(row).height = 38;
        row++;
      });
      
      row += 2;
      
      // TOP 3 PARTIDOS CON DISEÑO PREMIUM
      summarySheet.mergeCells(`B${row}:E${row}`);
      const top3Header = summarySheet.getCell(`B${row}`);
      top3Header.value = '🌟 PODIO - TOP 3 PARTIDOS MÁS VOTADOS';
      top3Header.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
      top3Header.alignment = { horizontal: 'center', vertical: 'middle' };
      top3Header.fill = {
        type: 'gradient',
        gradient: 'angle',
        degree: 45,
        stops: [
          { position: 0, color: { argb: 'FF6366F1' } },
          { position: 1, color: { argb: 'FFEC4899' } }
        ]
      };
      summarySheet.getRow(row).height = 35;
      row++;
      
      // Headers de tabla Top 3
      const tableHeaders = ['🏅 POS', 'PARTIDO POLÍTICO', 'VOTOS', 'PORCENTAJE'];
      ['B', 'C', 'D', 'E'].forEach((col, index) => {
        const cell = summarySheet.getCell(`${col}${row}`);
        cell.value = tableHeaders[index];
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1E293B' }
        };
        cell.border = {
          top: { style: 'medium', color: { argb: 'FF0F172A' } },
          bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
          left: { style: 'thin', color: { argb: 'FF475569' } },
          right: { style: 'thin', color: { argb: 'FF475569' } }
        };
      });
      summarySheet.getRow(row).height = 28;
      row++;
      
      // Top 3 data con medallas
      const medals = ['🥇 1°', '🥈 2°', '🥉 3°'];
      const medalColors = ['FFFFD700', 'FFC0C0C0', 'FFCD7F32'];
      const medalTextColors = ['FF1F2937', 'FF1F2937', 'FF1F2937'];
      
      sortedParties.slice(0, 3).forEach((party, index) => {
        const percentage = totalVotes > 0 ? ((party.votes / totalVotes) * 100).toFixed(2) : 0;
        
        summarySheet.getCell(`B${row}`).value = medals[index];
        summarySheet.getCell(`C${row}`).value = party.name;
        summarySheet.getCell(`D${row}`).value = party.votes;
        summarySheet.getCell(`E${row}`).value = `${percentage}%`;
        
        ['B', 'C', 'D', 'E'].forEach(col => {
          const cell = summarySheet.getCell(`${col}${row}`);
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: medalColors[index] }
          };
          cell.font = { bold: true, size: 12, color: { argb: medalTextColors[index] } };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFDACFAA' } },
            bottom: { style: 'thin', color: { argb: 'FFDACFAA' } },
            left: { style: 'thin', color: { argb: 'FFDACFAA' } },
            right: { style: 'thin', color: { argb: 'FFDACFAA' } }
          };
        });
        
        if (index === 0) {
          summarySheet.getRow(row).height = 35;
        } else {
          summarySheet.getRow(row).height = 28;
        }
        row++;
      });
      
      // ===== HOJA 3: RESULTADOS DETALLADOS PREMIUM =====
      const detailSheet = workbook.addWorksheet('📋 Resultados Completos', {
        properties: { tabColor: { argb: 'FF3B82F6' } }
      });
      
      detailSheet.columns = [
        { width: 3 },
        { width: 10 },
        { width: 32 },
        { width: 15 },
        { width: 14 },
        { width: 16 },
        { width: 35 },
        { width: 3 }
      ];
      
      // Header premium
      detailSheet.mergeCells('B2:G3');
      const detailHeader = detailSheet.getCell('B2');
      detailHeader.value = '📊 RESULTADOS OFICIALES COMPLETOS\nTODOS LOS PARTIDOS PARTICIPANTES';
      detailHeader.font = { size: 20, bold: true, color: { argb: 'FFFFFFFF' } };
      detailHeader.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      detailHeader.fill = {
        type: 'gradient',
        gradient: 'angle',
        degree: 135,
        stops: [
          { position: 0, color: { argb: 'FF3B82F6' } },
          { position: 1, color: { argb: 'FF8B5CF6' } }
        ]
      };
      detailSheet.getRow(2).height = 50;
      
      detailSheet.getRow(4).height = 8;
      
      // Headers de tabla mejorados
      const detailHeaders = ['#️⃣', 'PARTIDO', 'SÍMBOLO', 'VOTOS', '%', 'DESCRIPCIÓN'];
      ['B', 'C', 'D', 'E', 'F', 'G'].forEach((col, index) => {
        const cell = detailSheet.getCell(`${col}5`);
        cell.value = detailHeaders[index];
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1E293B' }
        };
        cell.border = {
          top: { style: 'medium', color: { argb: 'FF0F172A' } },
          bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
          left: { style: 'thin', color: { argb: 'FF475569' } },
          right: { style: 'thin', color: { argb: 'FF475569' } }
        };
      });
      detailSheet.getRow(5).height = 30;
      
      // Datos detallados
      let rowNum = 6;
      sortedParties.forEach((party, index) => {
        const percentage = totalVotes > 0 ? (party.votes / totalVotes) : 0;
        const isWinner = index === 0 && party.votes > 0;
        const isTop3 = index < 3;
        
        detailSheet.getCell(`B${rowNum}`).value = index + 1;
        detailSheet.getCell(`C${rowNum}`).value = party.name;
        detailSheet.getCell(`D${rowNum}`).value = party.symbol.toUpperCase();
        detailSheet.getCell(`E${rowNum}`).value = party.votes;
        detailSheet.getCell(`F${rowNum}`).value = percentage;
        detailSheet.getCell(`G${rowNum}`).value = party.description;
        
        let bgColor = 'FFFFFFFF';
        let fontColor = 'FF1F2937';
        let bold = false;
        if (isWinner) {
          bgColor = 'FFFFF4DC'; // Dorado claro
          fontColor = 'FF92400E';
          bold = true;
        } else if (isTop3) {
          bgColor = 'FFF3F4F6'; // Gris claro
        } else if (index % 2 === 1) {
          bgColor = 'FFFAFAFA'; // Alternado
        }
        
        ['B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
          const cell = detailSheet.getCell(`${col}${rowNum}`);
          cell.alignment = { horizontal: col === 'C' || col === 'G' ? 'left' : 'center', vertical: 'top', wrapText: true };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: bgColor }
          };
          cell.font = { bold, size: 11, color: { argb: fontColor } };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
          };
          
          if (col === 'F') {
            cell.numFmt = '0.00"%"';
            cell.font = { bold: true, color: { argb: 'FF8B5CF6' }, size: 12 };
          }
        });
        
        detailSheet.getRow(rowNum).height = isWinner ? 32 : 25;
        rowNum++;
      });
      
      // Fila de totales
      const totalRow = rowNum;
      detailSheet.mergeCells(`B${totalRow}:D${totalRow}`);
      const totalLabelCell = detailSheet.getCell(`B${totalRow}`);
      totalLabelCell.value = 'TOTALES:';
      totalLabelCell.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
      totalLabelCell.alignment = { horizontal: 'right', vertical: 'middle' };
      totalLabelCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E293B' }
      };
      totalLabelCell.border = {
        top: { style: 'medium', color: { argb: 'FF8B5CF6' } },
        bottom: { style: 'medium', color: { argb: 'FF8B5CF6' } }
      };
      
      const totalVotesCell = detailSheet.getCell(`E${totalRow}`);
      totalVotesCell.value = totalVotes;
      totalVotesCell.font = { size: 14, bold: true, color: { argb: 'FF1E293B' } };
      totalVotesCell.alignment = { horizontal: 'center', vertical: 'middle' };
      totalVotesCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDBEAFE' }
      };
      totalVotesCell.border = {
        top: { style: 'medium', color: { argb: 'FF8B5CF6' } },
        bottom: { style: 'medium', color: { argb: 'FF8B5CF6' } }
      };
      
      const totalPercentCell = detailSheet.getCell(`F${totalRow}`);
      totalPercentCell.value = 1;
      totalPercentCell.numFmt = '0.00"%"';
      totalPercentCell.font = { size: 14, bold: true, color: { argb: 'FF1E293B' } };
      totalPercentCell.alignment = { horizontal: 'center', vertical: 'middle' };
      totalPercentCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF8B5CF6' }
      };
      totalPercentCell.border = {
        top: { style: 'medium', color: { argb: 'FF8B5CF6' } },
        bottom: { style: 'medium', color: { argb: 'FF8B5CF6' } }
      };
      
      detailSheet.getCell(`G${totalRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF8B5CF6' }
      };
      detailSheet.getCell(`G${totalRow}`).border = {
        top: { style: 'medium', color: { argb: 'FF8B5CF6' } },
        bottom: { style: 'medium', color: { argb: 'FF8B5CF6' } },
        right: { style: 'medium', color: { argb: 'FF8B5CF6' } }
      };
      detailSheet.getRow(totalRow).height = 40;

      // ===== HOJA 4: ANÁLISIS GRÁFICO MEJORADO =====
      const chartSheet = workbook.addWorksheet('📈 Análisis Visual', {
        properties: { tabColor: { argb: 'FF10B981' } }
      });
      
      chartSheet.columns = [
        { width: 3 },
        { width: 35 },
        { width: 16 },
        { width: 50 },
        { width: 3 }
      ];
      
      // Header
      chartSheet.mergeCells('B2:D3');
      const chartHeader = chartSheet.getCell('B2');
      chartHeader.value = '📈 ANÁLISIS VISUAL DE VOTOS\nGRÁFICO DE BARRAS DE RESULTADOS';
      chartHeader.font = { size: 20, bold: true, color: { argb: 'FFFFFFFF' } };
      chartHeader.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      chartHeader.fill = {
        type: 'gradient',
        gradient: 'angle',
        degree: 45,
        stops: [
          { position: 0, color: { argb: 'FF10B981' } },
          { position: 1, color: { argb: 'FF06B6D4' } }
        ]
      };
      chartSheet.getRow(2).height = 50;
      
      chartSheet.getRow(4).height = 10;

      // Headers de la tabla gráfica
      const chartHeaders = ['PARTIDO', 'VOTOS', 'PORCENTAJE / BARRA'];
      ['B', 'C', 'D'].forEach((col, index) => {
        const cell = chartSheet.getCell(`${col}5`);
        cell.value = chartHeaders[index];
        cell.font = { bold: true, color: { argb: 'FF1E293B' }, size: 12 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD1FAE5' } // Color de fondo claro
        };
        cell.border = {
          top: { style: 'medium', color: { argb: 'FF10B981' } },
          bottom: { style: 'medium', color: { argb: 'FF10B981' } }
        };
      });
      chartSheet.getRow(5).height = 30;
      
      // Datos de la tabla gráfica
      rowNum = 6;
      const maxVotes = sortedParties[0]?.votes || 1;
      
      sortedParties.forEach((party, index) => {
        const percentage = totalVotes > 0 ? ((party.votes / totalVotes) * 100).toFixed(2) : 0;
        const barLength = party.votes / maxVotes;
        const numBlocks = Math.round(barLength * 30);
        const bar = '█'.repeat(numBlocks) + (numBlocks < 30 ? '░'.repeat(30 - numBlocks) : '');
        
        chartSheet.getCell(`B${rowNum}`).value = `${index + 1}. ${party.name}`;
        chartSheet.getCell(`C${rowNum}`).value = party.votes;
        chartSheet.getCell(`D${rowNum}`).value = `${bar} ${percentage}%`;
        
        const isTop3 = index < 3;
        const bgColor = isTop3 ? (index === 0 ? 'FFFEF3C7' : 'FFF3F4F6') : (index % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB');
        const barColor = index === 0 ? 'FFF59E0B' : (isTop3 ? 'FF8B5CF6' : 'FF6366F1');

        chartSheet.getCell(`B${rowNum}`).alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
        chartSheet.getCell(`B${rowNum}`).font = { bold: isTop3, size: 11 };
        
        chartSheet.getCell(`C${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' };
        chartSheet.getCell(`C${rowNum}`).font = { bold: true, size: 12, color: { argb: 'FF1F2937' } };
        
        chartSheet.getCell(`D${rowNum}`).alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
        chartSheet.getCell(`D${rowNum}`).font = { color: { argb: barColor }, bold: true, size: 10 };
        
        ['B', 'C', 'D'].forEach(col => {
          chartSheet.getCell(`${col}${rowNum}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: bgColor }
          };
          chartSheet.getCell(`${col}${rowNum}`).border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } }
          };
        });

        chartSheet.getRow(rowNum).height = 25;
        rowNum++;
      });
      
      // Footer con datos
      const footerRow = rowNum + 1;
      chartSheet.mergeCells(`B${footerRow}:D${footerRow}`);
      const footerCell = chartSheet.getCell(`B${footerRow}`);
      footerCell.value = `Total de Votos: ${totalVotes} | Partidos: ${parties.length} | Reporte Generado: ${date}`;
      footerCell.font = { size: 10, italic: true, color: { argb: 'FF6B7280' } };
      footerCell.alignment = { horizontal: 'center' };
      chartSheet.getRow(footerRow).height = 20;

      // ===== HOJA 5: ESTADÍSTICAS AVANZADAS =====
      const statsSheet = workbook.addWorksheet('📊 Estadísticas', {
        properties: { tabColor: { argb: 'FFF59E0B' } }
      });
      
      statsSheet.columns = [
        { width: 3 },
        { width: 45 },
        { width: 25 },
        { width: 3 }
      ];
      
      // Header
      statsSheet.mergeCells('B2:C2');
      const statsHeader = statsSheet.getCell('B2');
      statsHeader.value = '🔢 ESTADÍSTICAS ELECTORALES AVANZADAS';
      statsHeader.font = { size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
      statsHeader.alignment = { horizontal: 'center', vertical: 'middle' };
      statsHeader.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF59E0B' }
      };
      statsSheet.getRow(2).height = 40;
      
      statsSheet.getRow(3).height = 10;

      const advancedStats = [
        { label: 'Total de Votos (Suma)', value: totalVotes },
        { label: 'Cantidad de Partidos', value: parties.length },
        { label: 'Votos del Partido Ganador (Moda de Votos)', value: sortedParties[0]?.votes || 0 },
        { label: 'Votos del Último Partido', value: sortedParties[sortedParties.length - 1]?.votes || 0 },
        { label: 'Promedio de Votos por Partido (Media)', value: parties.length > 0 ? (totalVotes / parties.length).toFixed(2) : 0 },
        { label: 'Desviación Estándar de Votos (Variación)', value: 'N/A (Cálculo complejo en ExcelJS)' },
        { label: 'Partido con Menos Votos', value: sortedParties[sortedParties.length - 1]?.name || 'N/A' },
        { label: 'Diferencia Ganador-Segundo', value: sortedParties[0] && sortedParties[1] ? (sortedParties[0].votes - sortedParties[1].votes) : 0 },
        { label: 'Porcentaje del Ganador', value: sortedParties[0] && totalVotes > 0 ? `${((sortedParties[0].votes / totalVotes) * 100).toFixed(2)}%` : '0%' },
        { label: 'Mediana de Votos', value: sortedParties.length > 0 ? sortedParties[Math.floor(sortedParties.length / 2)]?.votes || 0 : 0 }
      ];
      
      let statsRow = 4;
      advancedStats.forEach((stat, idx) => {
        statsSheet.getCell(`B${statsRow}`).value = stat.label;
        statsSheet.getCell(`B${statsRow}`).font = { bold: true, size: 11 };
        statsSheet.getCell(`B${statsRow}`).alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
        statsSheet.getCell(`B${statsRow}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: 'FFF3F4F6'
        };
        statsSheet.getCell(`C${statsRow}`).value = stat.value;
        statsSheet.getCell(`C${statsRow}`).font = { bold: true, size: 13, color: { argb: 'FF8B5CF6' } };
        statsSheet.getCell(`C${statsRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
        statsSheet.getCell(`C${statsRow}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: 'FFFAFAFA'
        };
        
        ['B', 'C'].forEach(col => {
          statsSheet.getCell(`${col}${statsRow}`).border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
          };
        });

        statsSheet.getRow(statsRow).height = 30;
        statsRow++;
      });
      
      // Generar el archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resultados_Elecciones_IGV_${date.replace(/\//g, '-')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      setTimeout(() => {
        alert('🎉 ¡Excel Profesional exportado exitosamente!\n\n📊 5 hojas incluidas:\n🏆 Portada\n📊 Resumen Ejecutivo\n📋 Resultados Completos\n📈 Análisis Visual\n📊 Estadísticas');
      }, 500);

    } catch (error) {
      console.error('Error al exportar Excel:', error);
      alert('❌ Error al exportar Excel: ' + error.message);
    }
  };

  const createPartyMutation = useMutation({
    mutationFn: async (partyData) => {
      let logoUrl = partyData.logo_url;
      if (logoFile) {
        logoUrl = await uploadLogoToSupabase(logoFile);
        if (!logoUrl) {
          throw new Error('No se pudo subir la imagen');
        }
      }
      return partiesApi.create({ ...partyData, logo_url: logoUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      setShowAddParty(false);
      setNewParty({
        name: "",
        symbol: "sol",
        color: PARTY_COLORS[0],
        description: "",
        slogan: "",
        logo_url: "",
      });
      setLogoFile(null);
      setLogoPreview(null);
    },
    onError: (error) => {
      alert('Error al crear partido: ' + error.message);
    }
  });

  const deletePartyMutation = useMutation({
    mutationFn: (partyId) => partiesApi.delete(partyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });

  const resetVotesMutation = useMutation({
    mutationFn: (partyId) => partiesApi.resetVotes(partyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });

  const resetAllVotes = () => {
    if (window.confirm("¿Estás seguro de que deseas resetear todos los votos? Esta acción no se puede deshacer.")) {
      parties.forEach((party) => {
        resetVotesMutation.mutate(party.id);
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  const totalVotes = parties.reduce((sum, p) => sum + p.votes, 0);
  const leadingParty = parties.reduce((max, party) => party.votes > max.votes ? party : max, { votes: -1 });
  const averageVotes = parties.length > 0 ? (totalVotes / parties.length).toFixed(1) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white flex flex-col items-center">
          <RefreshCw className="w-8 h-8 animate-spin text-pink-500" />
          <p className="mt-4 text-lg">Cargando datos administrativos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Logout */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex justify-between items-center mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-xl hover:border-pink-500/50 transition-all text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver a Inicio</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/40 backdrop-blur-xl border border-red-700/50 rounded-xl hover:bg-red-900/60 transition-all text-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Salir del Panel</span>
          </motion.button>
        </motion.div>

        {/* Hero Header - Título Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl shadow-2xl p-8 mb-6"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-white/90" /> Panel de Administración
            </h1>
            <p className="text-purple-100 text-lg mb-0">
              Gestión de Elecciones Estudiantiles - Colegio Inka Garsaliso De La Vega
            </p>
          </div>
        </motion.div>

        {/* Action Buttons - Bloque 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6 shadow-xl"
        >
          <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" /> Acciones de Control
          </h3>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddParty(!showAddParty)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl shadow-lg text-white font-bold hover:shadow-cyan-500/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Añadir Nuevo Partido</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportToExcel}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg text-white font-bold hover:shadow-pink-500/30 transition-all"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span>Exportar Resultados (Excel)</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetAllVotes}
              className="flex items-center gap-2 px-6 py-3 bg-red-900/40 border border-red-700/50 rounded-xl shadow-lg text-red-300 font-bold hover:bg-red-900/60 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              <span>Resetear TODOS los Votos</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid - Bloque 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Total Votes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
            <p className="text-slate-300 text-sm font-medium mb-1">Votos Totales</p>
            <p className="text-4xl font-black text-white">{totalVotes}</p>
            <p className="text-blue-300 text-xs mt-2">Registrados en el sistema</p>
          </motion.div>

          {/* Parties Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <Users className="w-8 h-8 text-purple-400 mb-3" />
            <p className="text-slate-300 text-sm font-medium mb-1">Partidos</p>
            <p className="text-4xl font-black text-white">{parties.length}</p>
            <p className="text-purple-300 text-xs mt-2">Compitiendo</p>
          </motion.div>

          {/* Leading Party */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <Award className="w-8 h-8 text-yellow-400 mb-3" />
            <p className="text-slate-300 text-sm font-medium mb-1">Líder Actual</p>
            <p className="text-xl md:text-2xl font-black text-white truncate max-w-full">
              {leadingParty.name || "N/A"}
            </p>
            <p className="text-yellow-300 text-xs mt-2">
              con {leadingParty.votes === -1 ? 0 : leadingParty.votes} votos
            </p>
          </motion.div>
          
          {/* Average Votes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <Activity className="w-8 h-8 text-orange-400 mb-3" />
            <p className="text-slate-300 text-sm font-medium mb-1">Promedio</p>
            <p className="text-4xl font-black text-white">{averageVotes}</p>
            <p className="text-orange-300 text-xs mt-2">Votos por partido</p>
          </motion.div>
        </div>

        {/* Layout Principal: Gráfico + Top 3/Lista */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Gráfico de Resultados - 2/3 (Sección Principal) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" /> Distribución de Votos (Gráfico)
            </h3>
            <ResultsChart parties={parties} />
          </motion.div>

          {/* Top 3 Partidos - 1/3 (Columna Lateral) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-pink-400" /> Podio: Top 3 Partidos
            </h3>

            <div className="space-y-4">
              {parties
                .sort((a, b) => b.votes - a.votes)
                .slice(0, 3)
                .map((party, index) => {
                  const percentage = totalVotes > 0 ? ((party.votes / totalVotes) * 100).toFixed(1) : 0;
                  const medals = ["🥇", "🥈", "🥉"];
                  
                  return (
                    <motion.div
                      key={party.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-slate-800 border-2 border-slate-700 rounded-xl"
                    >
                      <span className="text-2xl font-bold">{medals[index]}</span>
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-white truncate">{party.name}</p>
                        <p className="text-xs text-slate-400">{party.slogan}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-pink-400">{party.votes}</p>
                        <p className="text-xs text-slate-400">{percentage}%</p>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>

          {/* Lista Completa de Partidos - Bloque 3 (Debajo del Gráfico) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="lg:col-span-3 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" /> Listado Detallado de Partidos
            </h3>
            
            {parties.length === 0 ? (
              <p className="text-slate-400 text-center py-10">No hay partidos registrados aún.</p>
            ) : (
              <div className="space-y-4">
                {parties
                  .sort((a, b) => b.votes - a.votes)
                  .map((party, index) => {
                    const percentage = totalVotes > 0 ? ((party.votes / totalVotes) * 100).toFixed(1) : 0;
                    
                    return (
                      <motion.div
                        key={party.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 + index * 0.03 }}
                        whileHover={{ scale: 1.01, y: -2 }}
                        className="relative overflow-hidden rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-slate-600 transition-all shadow-lg"
                      >
                        {/* Barra de progreso */}
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            background: `linear-gradient(to right, ${party.color} ${percentage}%, transparent ${percentage}%)`
                          }}
                        ></div>
                        
                        <div className="relative flex items-center gap-4 p-4">
                          {/* Logo/Simbolo */}
                          <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-slate-600 flex items-center justify-center bg-slate-700">
                            {party.logo_url ? (
                              <img src={party.logo_url} alt={`${party.name} logo`} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <span className="text-xl font-bold text-white">{party.symbol.slice(0, 1).toUpperCase()}</span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-grow min-w-0">
                            <p className="text-lg font-black text-white truncate">{index + 1}. {party.name}</p>
                            <p className="text-sm text-slate-400 truncate">{party.slogan}</p>
                          </div>
                          
                          {/* Estadísticas */}
                          <div className="flex-shrink-0 text-right">
                            <p className="text-xl font-black text-white">{party.votes}</p>
                            <p className="text-xs font-medium text-slate-400">{percentage}%</p>
                          </div>
                          
                          {/* Acciones */}
                          <div className="flex-shrink-0 flex items-center gap-2 ml-4">
                            <span 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: party.color }} 
                              title={`Color: ${party.color}`}
                            ></span>
                            <span className="text-sm font-bold text-pink-500">{party.symbol}</span>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => resetVotesMutation.mutate(party.id)}
                              className="p-3 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-all text-slate-300 hover:text-white"
                              title="Resetear votos"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                if (window.confirm(`¿Eliminar ${party.name}? Esta acción no se puede deshacer.`)) {
                                  deletePartyMutation.mutate(party.id);
                                }
                              }}
                              className="p-3 bg-red-900/50 border border-red-700 rounded-lg hover:bg-red-900/70 transition-all text-red-300 hover:text-red-200"
                              title="Eliminar partido"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Modal for Adding Party */}
      <AnimatePresence>
        {showAddParty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              // Color de fondo del modal cambiado a un oscuro profesional
              className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-3xl" 
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Plus className="w-6 h-6 text-pink-500" />
                  Añadir Nuevo Partido
                </h2>
                <button onClick={() => setShowAddParty(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => {
                e.preventDefault();
                createPartyMutation.mutate(newParty);
              }}>
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Nombre del Partido</label>
                  <input
                    type="text"
                    value={newParty.name}
                    onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                    placeholder="Nombre"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-slate-500"
                  />
                </div>
                
                {/* Símbolo */}
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Símbolo</label>
                  <select
                    value={newParty.symbol}
                    onChange={(e) => setNewParty({ ...newParty, symbol: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
                  >
                    {SYMBOLS.map(symbol => (
                      <option key={symbol} value={symbol}>{symbol.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                
                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-300 mb-2">Descripción</label>
                  <textarea
                    value={newParty.description}
                    onChange={(e) => setNewParty({ ...newParty, description: e.target.value })}
                    placeholder="Breve descripción del partido y su ideología"
                    rows="3"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-slate-500"
                  />
                </div>
                
                {/* Color y Slogan */}
                <div className="flex gap-4 items-end">
                  {/* Color */}
                  <div className="flex-grow">
                    <label className="block text-sm font-bold text-slate-300 mb-2">Color Principal</label>
                    <input
                      type="color"
                      value={newParty.color}
                      onChange={(e) => setNewParty({ ...newParty, color: e.target.value })}
                      className="w-full h-12 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  {/* Slogan */}
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-300 mb-2">Slogan</label>
                    <input
                      type="text"
                      value={newParty.slogan}
                      onChange={(e) => setNewParty({ ...newParty, slogan: e.target.value })}
                      placeholder="Slogan del partido"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Upload de Logo */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-300 mb-2">Logo del Partido (Opcional)</label>
                  <div className="flex gap-4 items-start">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      {logoPreview ? (
                        <div className="relative w-32 h-32 bg-slate-800 border-2 border-pink-500 rounded-xl overflow-hidden">
                          <img src={logoPreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
                          <button
                            onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 rounded-full p-1 transition-all"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center text-slate-500">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Input de archivo */}
                    <div className="flex-1">
                      <label
                        htmlFor="logo-upload"
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg text-white font-bold cursor-pointer transition-all ${
                          uploadingLogo
                            ? 'bg-slate-700'
                            : 'bg-gradient-to-r from-pink-600 to-red-600 hover:shadow-pink-500/30'
                        }`}
                      >
                        {uploadingLogo ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                        <span>{uploadingLogo ? 'Subiendo...' : 'Seleccionar Imagen'}</span>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          disabled={uploadingLogo}
                        />
                      </label>
                      <p className="text-slate-400 text-xs mt-2">Formatos: JPG, PNG. Máximo 5MB.</p>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="md:col-span-2 mt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={createPartyMutation.isPending || uploadingLogo}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl shadow-lg text-white font-bold hover:shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createPartyMutation.isPending || uploadingLogo ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>{createPartyMutation.isPending ? 'Guardando...' : 'Guardar Partido'}</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}