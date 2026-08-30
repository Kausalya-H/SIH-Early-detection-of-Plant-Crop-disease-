from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    ListFlowable, ListItem
)


def generate_crop_report(
    output_path, farmer_name, phone, location, crop, disease,
    confidence, severity, warning_signs, advice, treatment,
    active_ingredient, application, safety_note, weather_risk=None
):
    doc = SimpleDocTemplate(
        output_path, pagesize=A4,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("ReportTitle", parent=styles["Title"],
                                 alignment=TA_CENTER, fontSize=20, spaceAfter=20)
    heading_style = ParagraphStyle("SectionHeading", parent=styles["Heading2"],
                                    fontSize=14, spaceBefore=12, spaceAfter=8)
    normal_style = styles["BodyText"]
    story = []

    # Title
    story.append(Paragraph("CROP HEALTH REPORT", title_style))
    story.append(Paragraph("AI-Powered Crop Disease Detection and Advisory", normal_style))
    story.append(Spacer(1, 15))

    # Farmer details
    story.append(Paragraph("Farmer Details", heading_style))
    farmer_data = [["Name", farmer_name], ["Phone", phone],
                   ["Location", location], ["Crop", crop]]
    t = Table(farmer_data, colWidths=[120, 350])
    t.setStyle(TableStyle([
        ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
        ("BACKGROUND", (0,0), (0,-1), colors.lightgrey),
        ("VALIGN", (0,0), (-1,-1), "TOP"), ("PADDING", (0,0), (-1,-1), 7)
    ]))
    story.append(t)

    # AI Diagnosis
    story.append(Paragraph("AI Disease Diagnosis", heading_style))
    conf_str = f"{confidence:.1f}%" if confidence > 1 else f"{confidence*100:.1f}%"
    diag_data = [["Disease", disease], ["Confidence", conf_str], ["Severity", severity]]
    t2 = Table(diag_data, colWidths=[120, 350])
    t2.setStyle(TableStyle([
        ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
        ("BACKGROUND", (0,0), (0,-1), colors.lightgrey),
        ("PADDING", (0,0), (-1,-1), 7)
    ]))
    story.append(t2)

    # Warning signs
    story.append(Paragraph("Early Warning Signs", heading_style))
    story.append(ListFlowable(
        [ListItem(Paragraph(s, normal_style)) for s in warning_signs],
        bulletType="bullet", leftIndent=20
    ))

    # Advice
    story.append(Paragraph("Crop Management Advice", heading_style))
    story.append(Paragraph(advice, normal_style))

    # Treatment
    story.append(Paragraph("Treatment Recommendation", heading_style))
    story.append(Paragraph(treatment, normal_style))

    # Pesticide
    story.append(Paragraph("Pesticide Recommendation", heading_style))
    pest_data = [["Active Ingredient", active_ingredient], ["Application", application]]
    t3 = Table(pest_data, colWidths=[120, 350])
    t3.setStyle(TableStyle([
        ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
        ("BACKGROUND", (0,0), (0,-1), colors.lightgrey),
        ("VALIGN", (0,0), (-1,-1), "TOP"), ("PADDING", (0,0), (-1,-1), 7)
    ]))
    story.append(t3)

    # Safety
    story.append(Paragraph("Safety Note", heading_style))
    story.append(Paragraph(safety_note, normal_style))

    # Weather Risk Section (if provided)
    if weather_risk and "error" not in weather_risk:
        story.append(Spacer(1, 15))
        story.append(Paragraph("Real-Time Weather Risk Assessment", heading_style))

        loc = weather_risk.get("location", "Unknown")
        temp = weather_risk.get("temperatureC", "N/A")
        humid = weather_risk.get("humidityPercent", "N/A")
        wind = weather_risk.get("windSpeedKmh", "N/A")
        condition = weather_risk.get("condition", "N/A")
        risk_idx = weather_risk.get("diseaseRiskIndex", "N/A")
        risk_score = weather_risk.get("diseaseRiskScore", "N/A")
        risk_reason = weather_risk.get("diseaseRiskReason", "")
        forecast = weather_risk.get("forecastSummary", "")
        rain = weather_risk.get("rainfallChancePercent", "N/A")
        spore = weather_risk.get("sporeDispersalRangeKm", "N/A")

        wx_data = [
            ["Location", str(loc)],
            ["Temperature", f"{temp} C"],
            ["Humidity", f"{humid}%"],
            ["Wind Speed", f"{wind} km/h"],
            ["Condition", str(condition)],
            ["Rain Chance", f"{rain}%"],
            ["Disease Risk", f"{risk_idx} (Score: {risk_score})"],
            ["Spore Dispersal", f"{spore} km"],
            ["Risk Reason", str(risk_reason)],
            ["Forecast", str(forecast)],
        ]
        t4 = Table(wx_data, colWidths=[120, 350])
        t4.setStyle(TableStyle([
            ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
            ("BACKGROUND", (0,0), (0,-1), colors.lightgrey),
            ("VALIGN", (0,0), (-1,-1), "TOP"), ("PADDING", (0,0), (-1,-1), 7),
            ("BACKGROUND", (0,6), (-1,6), colors.Color(1, 0.9, 0.9)),
        ]))
        story.append(t4)

        # Pathogen-specific risk
        pathogen = weather_risk.get("pathogenRisk", {})
        if pathogen:
            story.append(Spacer(1, 8))
            story.append(Paragraph("Pathogen-Specific Risk Breakdown", heading_style))
            pat_data = [
                ["Pathogen Type", "Risk Level", "Score"],
                ["Fungal", pathogen.get("fungal",{}).get("level","N/A"),
                 str(pathogen.get("fungal",{}).get("score","N/A"))],
                ["Bacterial", pathogen.get("bacterial",{}).get("level","N/A"),
                 str(pathogen.get("bacterial",{}).get("score","N/A"))],
                ["Oomycete", pathogen.get("oomycete",{}).get("level","N/A"),
                 str(pathogen.get("oomycete",{}).get("score","N/A"))],
            ]
            t5 = Table(pat_data, colWidths=[150, 120, 100])
            t5.setStyle(TableStyle([
                ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
                ("BACKGROUND", (0,0), (-1,0), colors.Color(0.85, 0.92, 0.85)),
                ("BACKGROUND", (0,1), (0,-1), colors.lightgrey),
                ("PADDING", (0,0), (-1,-1), 7),
                ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
            ]))
            story.append(t5)

    story.append(Spacer(1, 20))
    story.append(Paragraph(
        "This report is generated using AI disease detection, real-time weather data "
        "from Open-Meteo, and local crop knowledge. Always follow locally approved "
        "product labels and agricultural guidance.", normal_style
    ))

    doc.build(story)
