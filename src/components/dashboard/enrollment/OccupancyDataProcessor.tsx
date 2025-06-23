
export const generateOccupancyData = (enrollmentData: any[], formSubmissionData: any, selectedSite: string) => {
  if (enrollmentData && enrollmentData.length > 0) {
    let currentOccupancy = 0;
    let plannedCapacity = 0;
    
    if (selectedSite === 'all') {
      // Sum all sites data for children
      currentOccupancy = enrollmentData.reduce((sum, item) => sum + item.children_present, 0);
      plannedCapacity = enrollmentData.reduce((sum, item) => sum + (item.planned_capacity || item.children_enrolled), 0);
    } else {
      // Get specific site data for children
      const siteData = enrollmentData.find(item => item.site === selectedSite) || enrollmentData[0];
      currentOccupancy = siteData.children_present;
      plannedCapacity = siteData.planned_capacity || siteData.children_enrolled;
    }
    
    return {
      occupancyData: [
        { name: 'Occupied', value: currentOccupancy, color: '#3b82f6' },
        { name: 'Available', value: Math.max(0, plannedCapacity - currentOccupancy), color: '#93c5fd' }
      ],
      currentOccupancy,
      plannedCapacity
    };
  } else {
    // Fallback data from form submissions for children
    let currentOccupancy = 0;
    let plannedCapacity = 0;
    
    if (selectedSite === 'all') {
      // Sum all sites children data
      currentOccupancy = formSubmissionData.attendanceData.reduce((sum: number, item: any) => sum + item.monthlyEnrollment, 0);
      plannedCapacity = Math.round(currentOccupancy * 1.2); // 20% buffer for children capacity
    } else {
      // Get specific site children data
      const siteInfo = formSubmissionData.attendanceData.find((item: any) => item.site === selectedSite) || formSubmissionData.attendanceData[0];
      currentOccupancy = siteInfo ? siteInfo.monthlyEnrollment : 25;
      plannedCapacity = Math.round(currentOccupancy * 1.2); // 20% buffer for children capacity
    }
    
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
