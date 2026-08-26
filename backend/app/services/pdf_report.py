from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    ListFlowable,
    ListItem
)


def generate_crop_report(
    output_path,
    farmer_name,
    phone,
    location,
    crop,
    disease,
    confidence,
    severity,
    warning_signs,
    advice,
    treatment,
    active_ingredient,
    application,
    safety_note
):

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=20,
        spaceAfter=20
    )

    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontSize=14,
        spaceBefore=12,
        spaceAfter=8
    )

    normal_style = styles["BodyText"]

    story = []

    # Title
    story.append(
        Paragraph("CROP HEALTH REPORT", title_style)
    )

    story.append(
        Paragraph(
            "AI-Powered Crop Disease Detection and Advisory",
            normal_style
        )
    )

    story.append(Spacer(1, 15))

    # Farmer details
    story.append(
        Paragraph("Farmer Details", heading_style)
    )

    farmer_data = [
        ["Name", farmer_name],
        ["Phone", phone],
        ["Location", location],
        ["Crop", crop]
    ]

    farmer_table = Table(
        farmer_data,
        colWidths=[120, 350]
    )

    farmer_table.setStyle(
        TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("PADDING", (0, 0), (-1, -1), 7)
        ])
    )

    story.append(farmer_table)

    # Diagnosis
    story.append(
        Paragraph("AI Disease Diagnosis", heading_style)
    )

    diagnosis_data = [
        ["Disease", disease],
        ["Confidence", f"{confidence * 100:.2f}%"],
        ["Severity", severity]
    ]

    diagnosis_table = Table(
        diagnosis_data,
        colWidths=[120, 350]
    )

    diagnosis_table.setStyle(
        TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
            ("PADDING", (0, 0), (-1, -1), 7)
        ])
    )

    story.append(diagnosis_table)

    # Warning signs
    story.append(
        Paragraph("Early Warning Signs", heading_style)
    )

    warning_list = ListFlowable(
        [
            ListItem(Paragraph(sign, normal_style))
            for sign in warning_signs
        ],
        bulletType="bullet",
        leftIndent=20
    )

    story.append(warning_list)

    # Advice
    story.append(
        Paragraph("Crop Management Advice", heading_style)
    )

    story.append(
        Paragraph(advice, normal_style)
    )

    # Treatment
    story.append(
        Paragraph("Treatment Recommendation", heading_style)
    )

    story.append(
        Paragraph(treatment, normal_style)
    )

    # Pesticide
    story.append(
        Paragraph("Pesticide Recommendation", heading_style)
    )

    pesticide_data = [
        ["Active Ingredient", active_ingredient],
        ["Application", application]
    ]

    pesticide_table = Table(
        pesticide_data,
        colWidths=[120, 350]
    )

    pesticide_table.setStyle(
        TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("PADDING", (0, 0), (-1, -1), 7)
        ])
    )

    story.append(pesticide_table)

    # Safety
    story.append(
        Paragraph("Safety Note", heading_style)
    )

    story.append(
        Paragraph(safety_note, normal_style)
    )

    story.append(Spacer(1, 20))

    story.append(
        Paragraph(
            "This report is generated using the AI disease detection "
            "system and local crop knowledge database. Always follow "
            "locally approved product labels and agricultural guidance.",
            normal_style
        )
    )

    doc.build(story)