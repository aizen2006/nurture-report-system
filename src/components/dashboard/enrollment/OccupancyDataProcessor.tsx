
export const generateOccupancyData = (enrollmentData: any[], formSubmissionData: any, selectedSite: string) => {
  if (enrollmentData && enrollmentData.length > 0) {
    const siteData = selectedSite === 'all' 
      ? enrollmentData[0] 
      : enrollmentData.find(item => item.site === selectedSite) || enrollmentData[0];
    
    const currentOccupancy = siteData.children_present;
    const plannedCapacity = siteData.planned_capacity || siteData.children_enrolled;
    
    return {
      occupancyData: [
        { name: 'Occupied', value: currentOccupancy, color: '#3b82f6' },
        { name: 'Available', value: Math.max(0, plannedCapacity - currentOccupancy), color: '#93c5fd' }
      ],
      currentOccupancy,
      plannedCapacity
    };
  } else {
    // Fallback data from form submissions
    const siteInfo = selectedSite === 'all' 
      ? formSubmissionData.attendanceData[0] 
      : formSubmissionData.attendanceData.find((item: any) => item.site === selectedSite) || formSubmissionData.attendanceData[0];
    
    const currentOccupancy = siteInfo ? siteInfo.monthlyEnrollment : 25;
    const plannedCapacity = Math.round(currentOccupancy * 1.2); // 20% buffer
    
    return {
      occupancyData: [
        { name: 'Occupied', value: currentOccupancy, color: '#3b82f6' },
        { name: 'Available', value: Math.max(0, plannedCapacity - currentOccupancy), color: '#93c5fd' }
      ],
      currentOccupancy,
      plannedCapacity
    };
  }
};
