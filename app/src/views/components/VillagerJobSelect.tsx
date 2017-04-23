import * as React from 'react';
import {VillagerJob, villagerJobsMap} from '../../data/VillagerJob';

export interface VillagerJobSelectProps {
    currentJob: VillagerJob;
    onChange: Function;
}

export const VillagerJobSelect = (props: VillagerJobSelectProps) =>
    <div>
        Job
        <select value={props.currentJob}
            onChange={e => props.onChange(e.target.value)}>
            {Object.keys(villagerJobsMap).map(jobKey => {
                const job = villagerJobsMap[parseInt(jobKey)];
                return (
                    <option key={job.enum} value={job.enum}>
                        {job.readableName}
                    </option>
                );
            })}
        </select>
    </div>