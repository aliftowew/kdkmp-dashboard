import streamlit as st
import matplotlib.pyplot as plt
import numpy as np

# --- SETTING HALAMAN ---
st.set_page_config(page_title="Dashboard KDKMP", layout="wide")

# --- KONSTANTA MATEMATIKA ---
POP_PER_KDKMP = 13070
E_FOOD = 753800
MULTIPLIER_K = 1.934
POVERTY_GAP = 36.2
AWAL_GINI = 0.37
PDB_NASIONAL_2025 = 23821.1

# --- SIDEBAR (PANEL KIRI) UNTUK SLIDER ---
st.sidebar.title("🎛️ Pengaturan Simulasi")
st.sidebar.markdown("Geser *slider* di bawah untuk melihat perubahan dampak ekonomi.")

pangsa_pasar = st.sidebar.slider("🛒 Pangsa Pasar KDKMP (%)", min_value=0, max_value=100, value=30, step=5)
diskon = st.sidebar.slider("🏷️ Diskon Harga Sembako (%)", min_value=0, max_value=15, value=2, step=1)
margin = st.sidebar.slider("📈 Margin KDKMP (%)", min_value=5, max_value=15, value=10, step=1)
jumlah_kdkmp = st.sidebar.slider("🏪 Jumlah KDKMP Nasional", min_value=1, max_value=83762, value=83762, step=1000)

# --- KALKULASI MATEMATIKA ---
s = pangsa_pasar / 100
d = diskon / 100
m = margin / 100

omzet_tahunan = POP_PER_KDKMP * E_FOOD * 12 * s * jumlah_kdkmp
penghematan_diskon = omzet_tahunan * d

total_margin = omzet_tahunan * m
shu_bottom40 = total_margin * 0.82
shu_desa = total_margin * 0.15
shu_pusat = total_margin * 0.03

tambahan_daya_beli = penghematan_diskon + shu_bottom40
tambahan_pdb = tambahan_daya_beli * MULTIPLIER_K

# Konversi ke Triliun
pdb_t = tambahan_pdb / 1e12
persen_pdb = (pdb_t / PDB_NASIONAL_2025) * 100
db_t = tambahan_daya_beli / 1e12
diskon_t = penghematan_diskon / 1e12
shu_b40_t = shu_bottom40 / 1e12
shu_desa_t = shu_desa / 1e12
shu_pusat_t = shu_pusat / 1e12
omzet_t = omzet_tahunan / 1e12

# Dampak Sosial
persen_miskin = min(100.0, (db_t / POVERTY_GAP) * 100)
gini_drop = min(0.08, (db_t / 2000) * 0.08)
new_gini = max(0.20, AWAL_GINI - gini_drop)

# --- TAMPILAN UTAMA (KANAN) ---
st.title("⚡ Dashboard Simulasi Ekonomi KDKMP")
st.markdown("Simulasi interaktif dampak makroekonomi dan sosial berdasarkan operasional Koperasi Desa Merah Putih.")

# Memasukkan kode HTML untuk tampilan Card
html_out = f"""
<div style="display: flex; gap: 15px; font-family: sans-serif; margin-bottom: 20px;">
    <div style="flex: 1; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 5px solid #f39c12;">
        <h4 style="margin-top: 0; color: #2c3e50; font-size: 16px; margin-bottom: 15px;">💰 Dampak Makroekonomi</h4>
        <div style="margin-bottom: 12px; font-size: 14px; color: #7f8c8d; border-bottom: 1px dashed #ecf0f1; padding-bottom: 8px;">Tambahan PDB:<br><span style="color: #27ae60; font-weight: bold; font-size: 16px;">+ Rp {pdb_t:,.2f} T</span></div>
        <div style="margin-bottom: 12px; font-size: 14px; color: #7f8c8d; border-bottom: 1px dashed #ecf0f1; padding-bottom: 8px;">Kontribusi ke PDB:<br><b style="color: #2c3e50; font-size: 15px;">+ {persen_pdb:.2f}%</b> dari target 2025</div>
        <div style="margin-bottom: 12px; font-size: 14px; color: #7f8c8d; padding-bottom: 8px;">Total Daya Beli Baru:<br><b style="color: #2c3e50; font-size: 15px;">Rp {db_t:,.2f} T</b></div>
    </div>
    
    <div style="flex: 1; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 5px solid #3498db;">
        <h4 style="margin-top: 0; color: #2c3e50; font-size: 16px; margin-bottom: 15px;">🤝 Dampak Sosial</h4>
        <div style="margin-bottom: 12px; font-size: 14px; color: #7f8c8d; border-bottom: 1px dashed #ecf0f1; padding-bottom: 8px;">Penutupan Poverty Gap:<br><span style="color: #27ae60; font-weight: bold; font-size: 16px;">{persen_miskin:.2f}% Tertutup</span></div>
        <div style="margin-bottom: 12px; font-size: 14px; color: #7f8c8d; border-bottom: 1px dashed #ecf0f1; padding-bottom: 8px;">Gini Ratio Awal:<br><b style="color: #2c3e50; font-size: 15px;">{AWAL_GINI}</b></div>
        <div style="margin-bottom: 12px; font-size: 14px; color: #7f8c8d; padding-bottom: 8px;">Estimasi Gini Baru:<br><span style="color: #27ae60; font-weight: bold; font-size: 16px;">{new_gini:.3f}</span></div>
    </div>
    
    <div style="flex: 1; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 5px solid #2ecc71;">
        <h4 style="margin-top: 0; color: #2c3e50; font-size: 16px; margin-bottom: 15px;">📊 Rincian Operasional</h4>
        <div style="margin-bottom: 12px; font-size: 14px; color: #7f8c8d; border-bottom: 1px dashed #ecf0f1; padding-bottom: 8px;">KDKMP Aktif:<br><b style="color: #2c3e50; font-size: 15px;">{jumlah_kdkmp:,} Titik</b></div>
        <div style="margin-bottom: 12px; font-size: 14px; color: #7f8c8d; border-bottom: 1px dashed #ecf0f1; padding-bottom: 8px;">Total Omzet Nasional:<br><b style="color: #2c3e50; font-size: 15px;">Rp {omzet_t:,.2f} T</b></div>
        <div style="margin-bottom: 12px; font-size: 14px; color: #7f8c8d; padding-bottom: 8px;">Uang Berputar di Desa:<br><span style="color: #27ae60; font-weight: bold; font-size: 16px;">Rp {(shu_b40_t + shu_desa_t):,.2f} T</span></div>
    </div>
</div>
"""
st.markdown(html_out, unsafe_allow_html=True)

# --- RENDER GRAFIK ---
st.markdown("### 📊 Distribusi Nilai Ekonomi Nasional (Triliun Rupiah)")
fig, ax = plt.subplots(figsize=(10, 4))
labels = ['Penghematan Warga', 'SHU Warga (82%)', 'SHU Desa (15%)', 'SHU Pusat (3%)']
values = [diskon_t, shu_b40_t, shu_desa_t, shu_pusat_t]
colors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c']

bars = ax.bar(labels, values, color=colors, width=0.5)
ax.set_ylim(0, 1500)
ax.set_ylabel('Triliun Rupiah', fontsize=10)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

for bar in bars:
    height = bar.get_height()
    ax.annotate(f'Rp {height:,.1f} T',
                xy=(bar.get_x() + bar.get_width() / 2, height),
                xytext=(0, 3), textcoords="offset points",
                ha='center', va='bottom', fontweight='bold', fontsize=10)

st.pyplot(fig)