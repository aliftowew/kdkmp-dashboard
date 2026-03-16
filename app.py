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

# --- TAMPILAN UTAMA (ATAS) ---
st.title("⚡ Dashboard Simulasi Ekonomi KDKMP")
st.markdown("Simulasi interaktif dampak makroekonomi dan sosial berdasarkan operasional Koperasi Desa Merah Putih.")
st.markdown("---")

# --- PENGATURAN SLIDER DI ATAS ---
st.subheader("🎛️ Pengaturan Simulasi")
col1, col2, col3, col4 = st.columns(4)

with col1:
    pangsa_pasar = st.slider("🛒 Pangsa Pasar KDKMP (%)", min_value=0, max_value=100, value=30, step=5)
with col2:
    diskon = st.slider("🏷️ Diskon Harga (%)", min_value=0, max_value=15, value=2, step=1)
with col3:
    margin = st.slider("📈 Margin KDKMP (%)", min_value=5, max_value=15, value=10, step=1)
with col4:
    jumlah_kdkmp = st.slider("🏪 Jumlah KDKMP", min_value=1, max_value=83762, value=83762, step=1000)

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

st.markdown("---")

# --- TAMPILAN KARTU (NATIVE STREAMLIT) ---
card1, card2, card3 = st.columns(3)

with card1:
    with st.container(border=True):
        st.subheader("💰 Dampak Makroekonomi")
        st.metric(label="Tambahan PDB", value=f"+ Rp {pdb_t:,.2f} T")
        st.metric(label="Kontribusi ke PDB 2025", value=f"+ {persen_pdb:.2f}%")
        st.metric(label="Total Daya Beli Baru", value=f"Rp {db_t:,.2f} T")

with card2:
    with st.container(border=True):
        st.subheader("🤝 Dampak Sosial")
        st.metric(label="Penutupan Poverty Gap", value=f"{persen_miskin:.2f}%")
        st.metric(label="Estimasi Gini Baru", value=f"{new_gini:.3f}", delta=f"-{gini_drop:.3f}", delta_color="inverse")
        st.metric(label="Gini Ratio Awal", value=f"{AWAL_GINI}")

with card3:
    with st.container(border=True):
        st.subheader("📊 Rincian Operasional")
        st.metric(label="KDKMP Aktif", value=f"{jumlah_kdkmp:,} Titik")
        st.metric(label="Total Omzet Nasional", value=f"Rp {omzet_t:,.2f} T")
        st.metric(label="Uang Berputar di Desa", value=f"Rp {(shu_b40_t + shu_desa_t):,.2f} T")

# --- RENDER GRAFIK ---
st.markdown("---")
st.subheader("📊 Distribusi Nilai Ekonomi Nasional (Triliun Rupiah)")
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
